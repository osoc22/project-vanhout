// import logo from './logo.svg';
import './App.css';
import './react-autosuggest.css';
import React, { Component,useEffect, useState} from 'react';
import {Canvas, extend, useThree} from '@react-three/fiber';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import {getJsonByProjectId, loadObjectsFromJson} from './components/ObjectLoader';
import AddressForm from './components/AddressForm';
import { Router, Routes, Route, useParams } from "react-router-dom";
import { createBrowserHistory } from "history";
// import * as THREE from 'three';

const history = createBrowserHistory();

extend({OrbitControls});
const Orbit = () => {
  const {camera, gl} = useThree();
  return(
    <orbitControls args={[camera, gl.domElement]}/>
  )
}

const Building = (props) => {
  const [projectMesh,setProjectMesh] = useState([])
  //const [projectId,setProjectId] = useState(props.projectId)
  const [projectId,_] = useState(props.projectId);

  const fetchProject = async function() {
    let objects = await loadObjectsFromJson(projectId)
    setProjectMesh(objects)
  }

  useEffect (() => {
    if(projectId){
      console.log(`ID: ${typeof(projectId)}`);
    }

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

// function App() {

//   return (
//   <div className='App'>
//       <AddressForm />
//   </div>

//   );
// }

function App() {
  let [projectId, setProjectId] = useState("");

  
  useEffect(()=>{
    console.log(`PROJECT ID: ${projectId}`);

    if (projectId){
      history.push(`/visualisation/:${projectId}`);
    }

      

  },[projectId]);
  

 

  return (
      <Router location={history.location} history={history}>
        <div className='App'>
        <Routes>
          <Route exact path="/" element={<AddressForm setProjectId={setProjectId} />}/>
          <Route path="/visualisation/:projectId"
                element={
                  <Canvas>
                    <Orbit/>
                    <Building projectId={projectId} />
                  </Canvas>
                } />
        </Routes>
        </div>
      </Router>
)};


export default App;
