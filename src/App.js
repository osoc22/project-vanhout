// import logo from './logo.svg';
import './App.css';
import React, { Component,useEffect, useState} from 'react';
import {Canvas, extend, useThree} from '@react-three/fiber';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import {getJsonByProjectId, loadObjectsFromJson} from './components/ObjectLoader';
// import * as THREE from 'three';

extend({OrbitControls});
const Orbit = () => {
  const {camera, gl} = useThree();
  return(
    <orbitControls args={[camera, gl.domElement]}/>
  )
}

const Building = (prop) => {
  const [projectMesh,setProjectMesh] = useState([])
  const [projectId,setProjectId] = useState(prop.projectId)

  const fetchProject = async function() {
    let objects = await loadObjectsFromJson(projectId)
    setProjectMesh(objects)
  }

  useEffect (() => {
    fetchProject()
  }, [projectId])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchProject()
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  return projectMesh

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
        <Building projectId={72}/>
      </Canvas>
  </div>

  );
}

export default App;
