// import logo from './logo.svg';
import './App.css';
import './react-autosuggest.css';
import React, { Component,useEffect, useState,Suspense} from 'react';
import {Canvas, extend, useThree} from '@react-three/fiber';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import {getModels, loadObjectsFromJson} from './components/ObjectLoader';
import AddressForm from './components/AddressForm';
import CameraControls from'./components/CamerControls';
import Slider from'./components/Slider';
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

const CameraHelper = () => {
  const camera = new OrthographicCamera(-2,2,2,-2);
  return <group position={[0,0,0]}>
    <cameraHelper args={[camera]} />
    </group>
}

function App() {
  let [projectId, setProjectId] = useState("");
  let [sliderValue, setSliderValue] = useState(1);

  const sliderToApp = (data) => {
    setSliderValue(data);
  }

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
                      <Building projectId={projectId} floor={sliderValue} />
                    </Canvas>
                  } />
          </Routes>
        <div>
          <p>{sliderValue}</p>
          <Slider sliderToApp={sliderToApp}/>
        </div>
        </div>
      </Router>
)};


export default App;
