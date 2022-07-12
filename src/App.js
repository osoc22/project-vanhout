// import logo from './logo.svg';
import './App.css';
import './react-autosuggest.css';
import React, { Component,useEffect, useState,Suspense} from 'react';
import {Canvas, extend, useThree, useLoader} from '@react-three/fiber';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import {getJsonByProjectId, loadObjectsFromJson} from './components/ObjectLoader';
import AddressForm from './components/AddressForm';
import {BathroomModel_Big } from './Model';
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

// function App() {

//   return (
//   <div className='App'>
//       <AddressForm />
//   </div>

//   );
// }

function App() {
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
  )

//   return (
//   <div className='App'>
//     {/* <AddressForm /> */}
//     <Canvas>
//       <Orbit/>
//       <Building projectId={13}/>
//     </Canvas>
//   </div>

// )};
  }


export default App;
