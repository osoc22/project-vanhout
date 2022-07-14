// import logo from './logo.svg';
import './App.css';
import './react-autosuggest.css';
import React, { Component,useEffect, useState,Suspense} from 'react';
import {Canvas, extend, useThree} from '@react-three/fiber';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import {getJsonByProjectId, loadObjectsFromJson} from './components/ObjectLoader';
import AddressForm from './components/AddressForm';
import CameraControls from'./components/CamerControls';
import { AmbientLight, OrthographicCamera, PerspectiveCamera } from 'three';
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
  const camera = new OrthographicCamera(-2,2,2,-2);
  return <group position={[0,0,0]}>
    <cameraHelper args={[camera]} />
    </group>
}

function App() {
  let [projectId, setProjectId] = useState("");

  return (
      <Router location={history.location} history={history}>
        <div className='App'>
        <Routes>
          <Route exact path="/" element={<AddressForm setProjectId={setProjectId} history={history} />}/>
          <Route path="/visualisation/:projectId"
                element={
                  <Canvas>
                    <Orbit/>
                    <ambientLight intensity={0.8} decay={10} color={"#FFFFFF"}/>
                    <Building projectId={projectId} />
                  </Canvas>
                } />
        </Routes>
        </div>
      </Router>
)};


export default App;
