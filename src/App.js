// import logo from './logo.svg';
import './App.css';
import './react-autosuggest.css';
import React, { Component,useEffect, useState,Suspense, useRef} from 'react';
import {Canvas, extend, useThree, useLoader, useFrame} from '@react-three/fiber';
import {getModels, loadObjectsFromJson} from './components/ObjectLoader';
import AddressForm from './components/AddressForm';
import{CameraControls, Orbit} from'./components/CameraControls';
import CameraButtons  from './components/CameraButtons';
import { Router, Routes, Route, HashRouter, Navigate} from "react-router-dom";
import Slider from'./components/Slider';
import { createBrowserHistory } from "history";
import { CreatePdf } from './components/PDFGen';

// import * as THREE from 'three';

const history = createBrowserHistory();

//Cursor 
const cursor = {
  x:0,
  y:0
}

const GlobalRenderSetter = (props) => {
  const {camera, gl} = useThree();
  props.setRenderer(gl)
}

const Building = (props) => {
  const [projectJSON,setProjectJSON] = useState([])
  const [projectMesh,setProjectMesh] = useState([])
  const [projectId,_p] = useState(props.projectId);
  const [floor,_f] = useState(parseInt(props.floor));
  
  const fetchModels = async function() {
    let models = await getModels(projectId)
    setProjectJSON(models)
    console.log(models)
  }

  const fetchProject = async function() {
    let objects = await loadObjectsFromJson(projectJSON, floor)
    setProjectMesh(objects)
  }

  useEffect (() => {
    fetchModels(projectId)
  }, [projectId])

  useEffect (() => {
    if(projectJSON.length) {
      fetchProject()
    }
    console.log(floor);
  }, [projectJSON, floor])

  

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchProject()
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);
  return projectMesh
}

const CameraHelper = (props) => {
 const {camera, gl} = useThree();
 const rotationNum = props.rotationNum
  const x = (rotationNum * Math.PI) / 180
  // useFrame(() => console.log(camera.position) )
  
  camera.rotation.set(x, 0, 0);
  //console.log(camera.rotation);
  // return <group position={props.position}>
  //   <cameraHelper args={[camera]} />
    
  //   </group>
    return <group>
    <cameraHelper args={[camera]} />
    
    </group>
}


// test APP
function App() {
  let [projectId, setProjectId] = useState("");
  let [moveUp, setMoveUp] = useState(false);
  let [renderer, setRenderer] = useState();
  let [center,setCenter] = useState([0,0,0]);
  let [sliderValue, setSliderValue] = useState(1);
  //console.log(`URL: ${process.env.PUBLIC_URL}`);

  useEffect(()=>{
    console.log("MOVE UP");
  },[moveUp]);

  const sliderToApp = (data) => {
    setSliderValue(data);
  }

  return (
      <HashRouter  location={history.location} history={history}>
        <div className='App'>
        <Routes>
          <Route path="/" element={projectId.length != 0 ? <Navigate to={`/visualisation/${projectId}`} /> : <AddressForm setProjectId={setProjectId} history={history} /> }>
          </Route>
          <Route path={`/visualisation/:projectId`}
                element={ <>
                  <CameraButtons rotNum={45} setMoveUp={setMoveUp} moveUp={moveUp} />
                  <Canvas  gl={{ preserveDrawingBuffer: true ,antialias:true}}>
                    <CameraHelper rotationNum={180}/>
                    <Orbit moveUp={moveUp} setMoveUp={setMoveUp} />
                    <Building projectId={projectId} setCenter={setCenter}/>
                    <GlobalRenderSetter setRenderer={setRenderer}/>
                  </Canvas>
                  </>
                } />
        </Routes>
        <button onClick={() => CreatePdf(renderer)}>??</button>
        <div>
          <p>{sliderValue}</p>
          <Slider sliderToApp={sliderToApp}/>
        </div>
        </div>
      </HashRouter>
)};

export default App;
