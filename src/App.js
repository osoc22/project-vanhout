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
import { Router, Routes, Route, HashRouter, Navigate} from "react-router-dom";
import { createBrowserHistory } from "history";
import { CreatePdf } from './components/PDFGen';
// import * as THREE from 'three';

const history = createBrowserHistory();

extend({OrbitControls});
const Orbit = () => {
  const {camera, gl} = useThree();
  return(
    <orbitControls attach='orbitControls' args={[camera, gl.domElement]}/>
  )
}

const GlobalRenderSetter = (props) => {
  const {camera, gl} = useThree();
  props.setRenderer(gl)
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
  //console.log(`URL: ${process.env.PUBLIC_URL}`);

  let [renderer, setRenderer] = useState();

  return (
      <HashRouter  location={history.location} history={history}>
        <div className='App'>
        <Routes>
          <Route path="/" element={projectId.length != 0 ? <Navigate to={`/visualisation/${projectId}`} /> : <AddressForm setProjectId={setProjectId} history={history} /> }>

          </Route>
          <Route path={`/visualisation/:projectId`}
                element={
                  <Canvas  gl={{ preserveDrawingBuffer: true ,antialias:true}}>
                    <Orbit/>
                    <ambientLight intensity={0.8} decay={10} color={"#FFFFFF"}/>
                    <Building projectId={projectId} />
                    <GlobalRenderSetter setRenderer={setRenderer}/>
                  </Canvas>
                } />
        </Routes>
        <button onClick={() => CreatePdf(renderer)}>??</button>
        </div>
      </HashRouter>
)};


export default App;
