// import logo from './logo.svg';
import './App.css';
import './react-autosuggest.css';
import React, { Component,useEffect, useState,Suspense} from 'react';
import {Canvas, extend, useThree, useLoader} from '@react-three/fiber';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import {getJsonByProjectId, loadObjectsFromJson} from './components/ObjectLoader';
import AddressForm from './components/AddressForm';
import {GLTFObject } from './components/GLTFModelLoader';
import CameraControls from'./components/CamerControls';
import CameraButtons  from './components/CameraButtons';
import * as THREE from 'three';
import { OrthographicCamera, PerspectiveCamera } from 'three';
import { Router, Routes, Route} from "react-router-dom";
import { createBrowserHistory } from "history";

// import * as THREE from 'three';

const history = createBrowserHistory();

extend({OrbitControls});
const Orbit = () => {
  const {camera, gl} = useThree();
  return(
    <orbitControls attach='orbitControls' args={[camera, gl.domElement]}/>
  )
}


//Cursor 
const cursor = {
  x:0,
  y:0
}
// window.addEventListener('mousemove', (e) => {
//   cursor.x = e.clientX / sizes.width - 0.5
//   cursor.y = -(e.clientY / sizes.height - 0.5)
// })


// Camera
// const  camera = new THREE.PerspectiveCamera(70, 2, 1, 1000);
// camera.position.z = 400;

// function resizeCanvasToDisplaySize() {
//   const canvas = renderer.domElement;
//   const width = canvas.clientWidth;
//   const height = canvas.clientHeight;
//   if (canvas.width !== width ||canvas.height !== height) {
//     // you must pass false here or three.js sadly fights the browser
//     renderer.setSize(width, height, false);
//     camera.aspect = width / height;
//     camera.updateProjectionMatrix();
//     console.log(width)

//     // set render target sizes here
//   }
// }


// resizeCanvasToDisplaySize();


const Building = (props) => {
  const [projectMesh,setProjectMesh] = useState([])
  const [projectId,_] = useState(props.projectId);

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
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  return projectMesh

}

const CameraHelper = () => {
  const  camera = new THREE.PerspectiveCamera(75, 2, 1, 5);
  console.log(camera)
  return <group position={[0,3,-20]}>
    <cameraHelper args={[camera]} />
    
    </group>
}

function App() {


  let [projectId, setProjectId] = useState("");

  return (
    <>
      <Router location={history.location} history={history}>
        <div className='App'>
        <Routes>
          <Route exact path="/" element={<AddressForm setProjectId={setProjectId} history={history} />}/>
          <Route path="/visualisation/:projectId"
                element={
                  <Canvas camera={{position:[0,0,-10], fov:75}}>
                    <CameraHelper/>
                    <ambientLight intensity={1}/>
                    <Orbit/>
                    <axesHelper args={[5]}/>
                    <Building projectId={projectId} />
                  </Canvas>
                } />
                
        </Routes>
        </div>
      </Router>
      <CameraButtons/>
      </>
)};


export default App;
