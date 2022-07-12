// import logo from './logo.svg';
import './App.css';
import React, { Component,useEffect, useState, Suspense} from 'react';
import {Canvas, extend, useThree, useLoader} from '@react-three/fiber';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import {getJsonByProjectId} from './components/ObjectLoader';
import {BathroomModel_Big, } from './Model';
import CameraControls from'./components/CamerControls';
import { OrthographicCamera, PerspectiveCamera } from 'three';
// import * as THREE from 'three';

extend({OrbitControls});
const Orbit = () => {
  const {camera, gl} = useThree();
  return(
    <orbitControls attach='orbitControls' args={[camera, gl.domElement]}/>
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
  const [json,setJson] = useState({})
  const [projectId,setProjectId] = useState(1);

  const fetchProject = async function() {
    let resp = await getJsonByProjectId(projectId)
    console.log(resp)
    setJson(resp)
    
  }

  const CameraHelper = () => {
    const camera = new OrthographicCamera(-2,2,2,-2);
    return <group position={[0,0,0]}>
      <cameraHelper args={[camera]} />
      </group>
  }
  useEffect (() => {
    fetchProject()
  }, [projectId])

  return (
  <div className='App'>
      <Canvas camera={{position:[0,0,-10], fov:75}}>
        {/* <CameraControls/> */}
        <ambientLight intensity={1}/>
        <Orbit/>
        <axesHelper args={[5]}/>
        <Suspense fallback={null}>
          <BathroomModel_Big path='/Models/Big_bathroom.gltf'/>
        </Suspense>
      </Canvas>
  </div>

  );
}

export default App;
