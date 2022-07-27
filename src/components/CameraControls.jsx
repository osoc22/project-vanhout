import {useFrame, useThree, extend} from '@react-three/fiber'
import React, {useRef} from 'react'
import {Vector2,Vector3} from 'three';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';

/** Orbicontrols is a standard three component to move and rotate in your scene an extend is needed to work with OrbitControls */
extend({OrbitControls});
const Orbit = (props) => {
  const {camera, gl} = useThree();

  /**Update directly the DOM when the app is started with position data */
  useEffect(()=>{
    camera.position.set(-props.position[0],props.position[1],props.position[2]);
  },[props.position]);

  let moveUp = props.moveUp;
  let setMoveUp = props.setMoveUp;  

  /** Update the camera position when you clicked on the button arrow up in every frame */
  useFrame(()=>{
    if (moveUp){
      console.log(`MOVE UP: ${moveUp}, ${JSON.stringify(camera.position)}`);
      camera.rotation.set(45*Math.PI/180,0,1);
      setMoveUp(false)
    }
  },[moveUp]);

  /** Ref to the controls ref name is defined at orbitcontrols as well */
  const controls = useRef();

  useFrame((e) => controls.current.update());

  return(
    <orbitControls 
    attach='orbitControls' 
    ref={controls} 
    args={[camera, gl.domElement]}

    /** Some props for the rotation of the orbitcontrols */
      // maxAzimuthAngle={Math.PI}
      // maxPolarAngle={Math.PI/4}
      // minAzimuthAngle={-Math.PI}
      // minPolarAngle={0}
    />
  )
}
export {Orbit};