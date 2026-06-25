import time
from fastapi import HTTPException, Request, status
import redis
from app.core.config import settings
from app.core.logging import logger

try:
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
except Exception as e:
    logger.warning(f"Redis connection failed for rate limiter, fallback disabled: {e}")
    redis_client = None

def check_rate_limit(request: Request):
    if not redis_client:
        return
        
    client_ip = request.client.host if request.client else "unknown"
    key = f"rate_limit:{client_ip}"
    
    try:
        current_calls = redis_client.get(key)
        if current_calls and int(current_calls) >= settings.RATE_LIMIT_CALLS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
        
        # Increment and set expiry
        pipeline = redis_client.pipeline()
        pipeline.incr(key)
        pipeline.expire(key, settings.RATE_LIMIT_PERIOD_SECONDS)
        pipeline.execute()
    except redis.RedisError as e:
        logger.error(f"Redis rate limiting error: {e}")
        return
