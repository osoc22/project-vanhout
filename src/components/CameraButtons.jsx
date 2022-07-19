import React, {useRef} from 'react'
import {useThree, useFrame} from '@react-three/fiber'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import arrowDown from '../arrows/arrow-down-square-fill.svg'
import left from '../arrows/arrow-left-square-fill.svg'
import up from '../arrows/arrow-up-square-fill.svg'
import right from '../arrows/arrow-right-square-fill.svg'
// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
// import from '';

// const CameraHelper = (props) => {
//     const  camera = new THREE.PerspectiveCamera(75, 2, 1, 5);
//     camera.rotation.x = 30;
//     console.log(camera.rotation.x)
//     return <group position={props.position} rotation={props.rotation}>
//       <cameraHelper args={[camera]} />
      
//       </group>
//   }

const xRotation = (cam, rotNum) => {
    const rotationNum = rotNum
    
    const x = (rotationNum * Math.PI) / 180
    cam.rotation.set(0,x, 0)
    console.log(cam.rotation)}

const CameraButtons = (props) => {
    const controls = useRef();
    return(
    <>
    {/* <CameraHelper position={[]}/> */}
        <button type="button" id="top" onClick={() => xRotation(props.camera, props.rotNum)}>
        <img src={up} alt="up" />  
        </button>

        {/* <button type="button" id="left-top">
        <img src={arrowDown} alt="arrowdown" />  
        </button type="button"> */}

        <button type="button" id="left">
        <img src={left} alt="left" />  
        </button>

        {/* <button type="button" id="left-back">
        <img src={leftDown} alt="leftdown" />  
        </button type="button"> */}

        {/* <button type="button" id="right-top">
        <img src={arrowDown} alt="arrowdown" />  
        </button type="button"> */}

        <button type="button" id="right">

        <img src={right} alt="right" />  
        </button> 

        {/* <button type="button" id="right-back">
            <img src={rightDown} alt="rightDown" />    
        </button type="button"> */}

        <button type="button" id="back">
            <img src={arrowDown} alt="arrowdown" />
        </button>
    </>
    )
}
export default CameraButtons;