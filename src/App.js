// import logo from './logo.svg';
import './App.css';
import {Canvas, extend, useThree} from '@react-three/fiber';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
// import * as THREE from 'three';

extend({OrbitControls});
const Orbit = () => {
  const {camera, gl} = useThree();
  return(
    <orbitControls args={[camera, gl.domElement]}/>
  )
}
const Box = () => {

  return(
  <mesh>
  <boxBufferGeometry/>
  <meshBasicMaterial/>

{/* Check the Axes of the object, args is the size*/}

  <axesHelper args={[5]}/>
  </mesh>
  )
}


function App() {
  return (
  <div className='App'>
      <Canvas>
        <Orbit/>
        <Box/>
      </Canvas>
  </div>

  );
}

export default App;
