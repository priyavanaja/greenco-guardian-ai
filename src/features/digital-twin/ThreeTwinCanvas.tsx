import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeTwinCanvasProps {
  onSelectComponent: (id: string) => void;
  activeComponent: string | null;
}

export const ThreeTwinCanvas: React.FC<ThreeTwinCanvasProps> = ({ onSelectComponent, activeComponent }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Dimensions
    const width = mountRef.current.clientWidth || 500;
    const height = mountRef.current.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f8fafc'); // Match light dashboard theme background

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(10, 12, 18);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Helpers - Grid
    const gridHelper = new THREE.GridHelper(30, 30, '#10b981', '#cbd5e1');
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Group for objects
    const group = new THREE.Group();
    scene.add(group);

    // 1. Factory Building
    const factoryGeom = new THREE.BoxGeometry(4, 3, 4);
    const factoryMat = new THREE.MeshStandardMaterial({ 
      color: activeComponent === 'factory' ? '#10b981' : '#64748b',
      roughness: 0.4
    });
    const factory = new THREE.Mesh(factoryGeom, factoryMat);
    factory.name = 'factory';
    factory.position.set(-3, 1, -3);
    group.add(factory);

    // Chimney
    const chimneyGeom = new THREE.CylinderGeometry(0.4, 0.4, 2.5, 16);
    const chimney = new THREE.Mesh(chimneyGeom, factoryMat);
    chimney.position.set(-2, 3.25, -2);
    group.add(chimney);

    // 2. Solar Panels
    const solarGroup = new THREE.Group();
    solarGroup.name = 'solar';
    const panelGeom = new THREE.BoxGeometry(1.5, 0.1, 2.5);
    const panelMat = new THREE.MeshStandardMaterial({ 
      color: activeComponent === 'solar' ? '#10b981' : '#1e3a8a',
      roughness: 0.1,
      metalness: 0.8
    });
    
    for (let i = 0; i < 3; i++) {
      const panel = new THREE.Mesh(panelGeom, panelMat);
      panel.name = 'solar';
      panel.position.set(2 + i * 2, 0.2, -4);
      panel.rotation.x = 0.3; // tilted
      solarGroup.add(panel);
    }
    group.add(solarGroup);

    // 3. Wind Turbine
    const turbineGroup = new THREE.Group();
    turbineGroup.name = 'wind';
    const towerGeom = new THREE.CylinderGeometry(0.2, 0.3, 6, 8);
    const towerMat = new THREE.MeshStandardMaterial({ color: '#94a3b8' });
    const tower = new THREE.Mesh(towerGeom, towerMat);
    tower.position.set(4, 3, 2);
    turbineGroup.add(tower);

    // Blades node group (so we can rotate blades easily)
    const bladesGroup = new THREE.Group();
    bladesGroup.position.set(4, 6, 2.5);
    
    const bladeGeom = new THREE.BoxGeometry(0.2, 2.5, 0.05);
    const bladeMat = new THREE.MeshStandardMaterial({ 
      color: activeComponent === 'wind' ? '#10b981' : '#ffffff' 
    });

    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(bladeGeom, bladeMat);
      blade.position.y = 1.25;
      const pivot = new THREE.Group();
      pivot.rotation.z = (Math.PI * 2 * i) / 3;
      pivot.add(blade);
      bladesGroup.add(pivot);
    }
    turbineGroup.add(bladesGroup);
    group.add(turbineGroup);

    // 4. Water Treatment Plant
    const waterGeom = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    const waterMat = new THREE.MeshStandardMaterial({ 
      color: activeComponent === 'water' ? '#10b981' : '#0284c7', 
      transparent: true, 
      opacity: 0.8,
      roughness: 0.1
    });
    const waterPlant = new THREE.Mesh(waterGeom, waterMat);
    waterPlant.name = 'water';
    waterPlant.position.set(-4, 0.5, 3);
    group.add(waterPlant);

    // 5. Waste Management Area
    const wasteGeom = new THREE.BoxGeometry(2, 1.2, 2);
    const wasteMat = new THREE.MeshStandardMaterial({ 
      color: activeComponent === 'waste' ? '#10b981' : '#d97706',
      roughness: 0.9
    });
    const wasteArea = new THREE.Mesh(wasteGeom, wasteMat);
    wasteArea.name = 'waste';
    wasteArea.position.set(0, 0.1, 4);
    group.add(wasteArea);

    // Raycasting for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        // Traverse up to find parent names if clicked child
        while (obj && obj !== scene) {
          if (['factory', 'solar', 'wind', 'water', 'waste'].includes(obj.name)) {
            onSelectComponent(obj.name);
            break;
          }
          obj = obj.parent;
        }
      }
    };

    renderer.domElement.addEventListener('click', onClick);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate turbine blades
      bladesGroup.rotation.z += 0.05;

      // Slow hover rotation of overall group for perspective depth
      group.rotation.y += 0.003;

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [onSelectComponent, activeComponent]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-[400px] bg-slate-50 rounded-xl relative overflow-hidden cursor-pointer"
      title="Click on factory elements to view telemetry data"
    />
  );
};
