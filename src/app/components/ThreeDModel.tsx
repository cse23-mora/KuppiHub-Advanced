import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';

function Model() {
  const { scene } = useGLTF('/model.glb');
  const [scale, setScale] = useState([2, 2, 2]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScale([3, 3, 3]); // Mobile
      } else if (width < 1024) {
        setScale([3, 3, 3]); // Tablet
      } else {
        setScale([3.5, 3.5, 3.5]); // Desktop
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <primitive object={scene} scale={scale} />;
}

export default function ThreeDModel() {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 3, 3]} intensity={1} />
        <Model />
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}


