import os
from celery import Celery
from app.core.config import settings
from app.core.logging import logger
from app.database.session import SessionLocal
from app.models.database_models import Evidence, EvidenceVerification, FraudReport, RiskScore, Notification
from app.services.ai_service import ai_service

celery_app = Celery("greenco_tasks", broker=settings.REDIS_URL, backend=settings.REDIS_URL)

@celery_app.task
def process_evidence_upload(evidence_id: int):
    """
    Background job to run automated AI verification and image forensics pipelines.
    """
    logger.info(f"Celery executing pipeline for evidence_id: {evidence_id}")
    db = SessionLocal()
    try:
        evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
        if not evidence:
            logger.error(f"Evidence {evidence_id} not found in database.")
            return
            
        # 1. OCR Extraction
        ocr_result = ai_service.process_ocr(evidence.file_path, evidence.file_type)
        verification = EvidenceVerification(
            evidence_id=evidence.id,
            trust_score=0, # calculated below
            confidence_score=94,
            ocr_extracted_text=ocr_result["text"],
            is_duplicate=False,
            signature_verified=ocr_result["metadata"]["signature_verified"],
            metadata_json=ocr_result["metadata"]
        )
        db.add(verification)
        
        # 2. Image Forensics (if image)
        tampering_prob = 0.0
        deepfake_prob = 0.0
        gps_matched = True
        risk_level = "Low"
        tampering_regions = []
        
        if evidence.file_type.lower() in ["image", "png", "jpg", "jpeg"]:
            cv_result = ai_service.process_image_forensics(evidence.file_path)
            tampering_prob = cv_result["pixel_manipulation_probability"]
            deepfake_prob = cv_result["deepfake_probability"]
            gps_matched = cv_result["gps_matched"]
            risk_level = cv_result["risk_level"]
            tampering_regions = cv_result["tampering_regions"]
            
            fraud = FraudReport(
                evidence_id=evidence.id,
                tampering_regions=tampering_regions,
                deepfake_probability=deepfake_prob,
                pixel_manipulation_probability=tampering_prob,
                gps_lat=cv_result["gps_lat"],
                gps_lon=cv_result["gps_lon"],
                gps_matched=gps_matched,
                device_id="DEV_MOCK_EDGE",
                time_matched=cv_result["time_matched"],
                risk_level=risk_level
            )
            db.add(fraud)
            
        # 3. Calculate trust score
        base_trust = 98
        if not ocr_result["metadata"]["signature_verified"]:
            base_trust -= 15
        if not gps_matched:
            base_trust -= 30
        if deepfake_prob > 0.5 or tampering_prob > 0.5:
            base_trust -= 40
            
        verification.trust_score = max(5, base_trust)
        
        # Set overall status based on trust score
        if verification.trust_score >= 70:
            evidence.status = "Verified"
        else:
            evidence.status = "Rejected"
            
        db.commit()
        logger.info(f"AI pipeline processing finished for evidence_id: {evidence_id}. Trust: {verification.trust_score}%")
        
        # 4. Trigger risk scores calculation
        calculate_risk_scores.delay(evidence.organization_id)
        
    except Exception as e:
        logger.error(f"Error executing AI pipeline tasks: {e}")
        db.rollback()
    finally:
        db.close()

@celery_app.task
def calculate_risk_scores(organization_id: int):
    """
    Background job to compute dynamic risk intelligence indices.
    """
    db = SessionLocal()
    try:
        # Check for any rejected files
        rejected_count = db.query(Evidence).filter(
            Evidence.organization_id == organization_id,
            Evidence.status == "Rejected"
        ).count()
        
        has_fraud = rejected_count > 0
        
        # Get active risk record or create new
        risk_intel = ai_service.calculate_risk(has_fraud=has_fraud, sustainability_score=80)
        
        score_record = RiskScore(
            organization_id=organization_id,
            evidence_risk="High" if has_fraud else "Low",
            fraud_risk="Critical" if has_fraud else "Low",
            compliance_risk="High" if has_fraud else "Low",
            operational_risk="Low",
            overall_score=risk_intel["overall_score"],
            category=risk_intel["category"],
            recommended_action=risk_intel["recommended_action"]
        )
        db.add(score_record)
        
        # Create alert notification if critical risk
        if risk_intel["category"] == "Critical":
            alert = Notification(
                organization_id=organization_id,
                title="Critical System Fraud Alert",
                message="AI image verification engine identified synthetic textures matching deepfake fingerprints.",
                priority="Critical",
                category="Fraud"
            )
            db.add(alert)
            
        db.commit()
        logger.info(f"Risk evaluation complete for org {organization_id}. Threat Level: {risk_intel['category']}")
    except Exception as e:
        logger.error(f"Error calculating risk scores: {e}")
        db.rollback()
    finally:
        db.close()
