// import logo from './logo.svg';
import './App.css';
import './react-autosuggest.css';
import React, { Component,useEffect, useState,Suspense, useRef} from 'react';
import {Canvas, extend, useThree, useLoader, useFrame} from '@react-three/fiber';
import { getLatestLayout,getModels, loadObjectsFromJson,getBuildingCenterFromJson,getFloorCount} from './components/ObjectLoader';
import AddressForm from './components/AddressForm';
import{CameraControls, Orbit} from'./components/CameraControls';
import CameraButtons  from './components/CameraButtons';
import { Router, Routes, Route, HashRouter, Navigate} from "react-router-dom";
import Slider from'./components/Slider';
import { createBrowserHistory } from "history";
import { CreatePdf } from './components/PDFGen';

const history = createBrowserHistory();

//Cursor 
const cursor = {
  x:0,
  y:0
}

const GlobalRenderSetter = (props) => {
  const {camera, gl,scene} = useThree();
  props.setThreeCanvas({"renderer":gl,"scene":scene,"camera":camera});
}

const Building = (props) => {
  const [projectMesh,setProjectMesh] = useState([])
  const [projectId,_p] = useState(props.projectId);

  const fetchModels = async function() {
    let models = await getModels(projectId)
    props.setProjectJSON(models)
    console.log(models)
  }

  useEffect (() => {
    fetchModels(projectId)
  }, [projectId])

  useEffect (() => {
    if(props.projectJSON.length) {
      let modelData = getLatestLayout(props.projectJSON);
      let objects = loadObjectsFromJson(modelData, props.sliderValue)
      setProjectMesh(objects)
      props.setCenter(getBuildingCenterFromJson(modelData,props.sliderValue))
      props.setFloorCount(getFloorCount(modelData))
    }
  }, [props.projectJSON])  

  useEffect(()=> {
    if(props.projectJSON.length) {
      let modelData = getLatestLayout(props.projectJSON);
      let objects = loadObjectsFromJson(modelData, props.sliderValue)
      setProjectMesh(objects)
    }
  },[props.sliderValue])

  document.querySelector('.invisible').style.display = "block";
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
  let [threeCanvas, setThreeCanvas] = useState();
  let [center,setCenter] = useState([0,0,1]);
  let [sliderValue, setSliderValue] = useState(1);
  let [floorCount,setFloorCount] = useState(1);
  let [projectJSON,setProjectJSON] = useState([]);

  useEffect(()=>{
    console.log("MOVE UP");
  },[moveUp]);

  const sliderToApp = (data) => {
    setSliderValue(parseInt(data));
  }

  useEffect(() => {
    console.log(center)
  },[center])


  return (
    <HashRouter  location={history.location} history={history}>
      <div className='App'>
        <Routes>
          <Route path="/" element={projectId.length != 0 ? <Navigate to={`/visualisation/${projectId}`} /> : <AddressForm setProjectId={setProjectId} history={history} /> }>
          </Route>
          <Route path={`/visualisation/:projectId`}
                element={ <>
                  {/* <CameraButtons rotNum={45} setMoveUp={setMoveUp} moveUp={moveUp} /> */}
                  <Canvas  gl={{ preserveDrawingBuffer: true ,antialias:true}}>
                    {/* <CameraHelper rotationNum={180}/> */}
                    <Building projectId={projectId} sliderValue={sliderValue} setCenter={setCenter} setProjectJSON={setProjectJSON} projectJSON={projectJSON} setFloorCount={setFloorCount}/>
                    <Orbit moveUp={moveUp} setMoveUp={setMoveUp} position={center}/>
                    <GlobalRenderSetter setThreeCanvas={setThreeCanvas}/>
                  </Canvas>
                  </>
                } />
        </Routes>
        <button onClick={() => CreatePdf(threeCanvas,projectJSON)}>??</button>
        <div className='slider_container invisible'>
          <p className='slider_current'>Current floor: {sliderValue}</p>
          <p>{floorCount+1}</p>
          <Slider sliderToApp={sliderToApp} max={floorCount+1}/>
          <p>1</p>
        </div>
      </div>
    </HashRouter>
)};

export default App;
