// import logo from './logo.svg';
import './App.css';
import React, { Component,useEffect, useState} from 'react';
import {Canvas, extend, useThree} from '@react-three/fiber';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import {getJsonByProjectId} from './ObjectLoader';
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
        <Orbit/>
        <Box/>
      </Canvas>
  </div>

  );
}

export default App;
