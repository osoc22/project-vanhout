import React, {useRef} from 'react'
import {useThree, useFrame} from '@react-three/fiber'
import arrowDown from '../arrows/arrow-down-square-fill.svg'
import left from '../arrows/arrow-left-square-fill.svg'
import up from '../arrows/arrow-up-square-fill.svg'
import right from '../arrows/arrow-right-square-fill.svg'


const CameraButtons = (props) => {
    return(
    <>
    {/* <CameraHelper position={[]}/> */}
        <button type="button" id="top" onClick={() => props.setMoveUp(true)}>
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