import React from 'react'
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
const CameraButtons = ({}) => {
    return(
    <>
    {/* <CameraHelper position={[]}/> */}
        <div id="top">
        <img src={up} alt="up" />  
        </div>

        {/* <div id="left-top">
        <img src={arrowDown} alt="arrowdown" />  
        </div> */}

        <div id="left">
        <img src={left} alt="left" />  
        </div>

        {/* <div id="left-back">
        <img src={leftDown} alt="leftdown" />  
        </div> */}

        {/* <div id="right-top">
        <img src={arrowDown} alt="arrowdown" />  
        </div> */}

        <div id="right">

        <img src={right} alt="right" />  
        </div> 

        {/* <div id="right-back">
            <img src={rightDown} alt="rightDown" />    
        </div> */}

        <div id="back">
            <img src={arrowDown} alt="arrowdown" />
        </div>
    </>
    )
}
export default CameraButtons;