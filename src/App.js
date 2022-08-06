// import logo from './logo.svg';
import './App.css';
import './react-autosuggest.css';
import React, {useEffect, useState} from 'react';
import {Canvas, useThree} from '@react-three/fiber';
import { getHighestFloorCount,loadBuildingsFromJson} from './components/ObjectLoader';
import {fetchProject} from './components/FetchJSON';
import AddressForm from './components/AddressForm';
import{CameraControls, Orbit} from'./components/CameraControls';
// import CameraButtons  from './components/CameraButtons';
import {Routes, Route, HashRouter, Navigate} from "react-router-dom";
import Slider from'./components/Slider';
import { createBrowserHistory } from "history";

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

const Buildings = (props) => {
  const [projectMesh,setProjectMesh] = useState([])
  const [projectId,_p] = useState(props.projectId);

  useEffect (() => {
    fetchProject(projectId,props.setProjectJSON)
  }, [projectId])

  useEffect (() => {
    if(props.projectJSON.length) {
      let objects = loadBuildingsFromJson(props.projectJSON, props.sliderValue)
      setProjectMesh(objects)
      props.setFloorCount(getHighestFloorCount(props.projectJSON))
    }
  }, [props.projectJSON])  

  useEffect(()=> {
    if(props.projectJSON.length) {
      let objects = loadBuildingsFromJson(props.projectJSON, props.sliderValue)
      setProjectMesh(objects)
    }
  },[props.sliderValue])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchProject() // this is old code that won't work anymore, change this to alter which configuration to load
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);
  return projectMesh
}

// shows camera visually
// const CameraHelper = (props) => {
//  const {camera, gl} = useThree();
//  const rotationNum = props.rotationNum
//   const x = (rotationNum * Math.PI) / 180
//   // useFrame(() => console.log(camera.position) )
  
//   camera.rotation.set(x, 0, 0);
//   //console.log(camera.rotation);
//   // return <group position={props.position}>
//   //   <cameraHelper args={[camera]} />
    
//   //   </group>
//     return <group>
//     <cameraHelper args={[camera]} />
    
//     </group>
// }


// test APP
function App() {
  let [projectId, setProjectId] = useState("");
  let [moveUp, setMoveUp] = useState(false);
  let [threeCanvas, setThreeCanvas] = useState();
  let [center,setCenter] = useState([0,0,1]);
  let [sliderValue, setSliderValue] = useState(1);
  let [floorCount,setFloorCount] = useState(1);
  let [projectJSON,setProjectJSON] = useState([]);

  // useEffect(()=>{
  //   console.log("MOVE UP");
  // },[moveUp]);

  const sliderToApp = (data) => {
    setSliderValue(parseInt(data));
  }

  useEffect(() => {
    document.title = 'Team Sphere | Demo';
  });

  return (
    <HashRouter  location={history.location} history={history}>
      <div className='App'>
        <Routes>
          <Route path="/" element={projectId.length != 0 ? <Navigate to={`/visualisation/${projectId}`} /> : <AddressForm setProjectId={setProjectId} history={history} /> }>
          </Route>
          <Route path={`/visualisation/:projectId`}
                element={ <>
                  {/* <CameraButtons rotNum={45} setMoveUp={setMoveUp} moveUp={moveUp} /> */}
                  <Canvas  gl={{ preserveDrawingBuffer: true ,antialias:true}} shadows >
                    {/* <CameraHelper rotationNum={180}/> */}
                    <Buildings projectId={projectId} sliderValue={sliderValue} setCenter={setCenter} setProjectJSON={setProjectJSON} projectJSON={projectJSON} setFloorCount={setFloorCount}/>
                    <Orbit moveUp={moveUp} setMoveUp={setMoveUp} position={center}/>
                    <GlobalRenderSetter setThreeCanvas={setThreeCanvas}/>
                  </Canvas>
                  {/* <button onClick={() => CreatePdf(threeCanvas,projectJSON)}>??</button> */}
                  <Slider sliderToApp={sliderToApp} floorCount={floorCount} sliderValue={sliderValue}/>
                  </>
                } />
        </Routes>
      </div>
    </HashRouter>
)};

export default App;
