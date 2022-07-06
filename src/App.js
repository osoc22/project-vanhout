// import logo from './logo.svg';
import './App.css';
import React, { Component,useEffect, useState, Suspense} from 'react';
import {Canvas, extend, useThree, useLoader} from '@react-three/fiber';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import {getJsonByProjectId} from './components/ObjectLoader';
import {BathroomModel_2, BathroomModel_color, } from './components/Model';
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
  const [json,setJson] = useState({})
  const [projectId,setProjectId] = useState(1)

  const fetchProject = async function() {
    let resp = await getJsonByProjectId(projectId)
    console.log(resp)
    setJson(resp)
    
  }

  useEffect (() => {
    fetchProject()
  }, [projectId])

  return (
  <div className='App'>
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={1}/>
          <Orbit/>
          <BathroomModel_2 path='/Models/Grote badkamer_export_2.obj'/>
          <BathroomModel_color path='/Models/bathroomtest.gltf'/>
        </Suspense>
        
      </Canvas>
  </div>

  );
}

export default App;
