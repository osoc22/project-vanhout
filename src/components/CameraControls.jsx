import {useFrame, useThree, extend} from '@react-three/fiber'
import React, {useRef} from 'react'
import {Vector2,Vector3} from 'three';
import {OrbitControls} from'three/examples/jsm/controls/OrbitControls';
import { useEffect } from 'react';


// const CameraControls = ({}) => {
//     const vec = new THREE.Vector3();
//     useFrame(({camera, scene }) => {
//         if(state.shouldUpdate){
//             camera.position.lerp(vec.set(...state.cameraPos, 0.1));
//             scene.orbitControls.target.lerp()
//             scene.orbitControls.update()

//             const updateVar = camera.position.clone()
//             .sub(state.cameraPos).length()
//             if(updateVar < 0.1) state.shouldUpdate = false;
//         }

//     })
//     return (
//         null
//     )
// }

extend({OrbitControls});
const Orbit = (props) => {
  const {camera, gl} = useThree();

  useEffect(()=>{
    // console.log(props.position[0])
    camera.position.set(-props.position[0],props.position[1],props.position[2]);
  },[props.position]);

  let moveUp = props.moveUp;
  let setMoveUp = props.setMoveUp;  

  useFrame(()=>{
    if (moveUp){
      console.log(`MOVE UP: ${moveUp}, ${JSON.stringify(camera.position)}`);
      camera.rotation.set(45*Math.PI/180,0,1);
      setMoveUp(false)
    }
  },[moveUp]);

  const controls = useRef();

  useFrame((e) => controls.current.update());

  return(
    <orbitControls 
    attach='orbitControls' 
    ref={controls} 
    args={[camera, gl.domElement]}
    // maxAzimuthAngle={Math.PI}
    // maxPolarAngle={Math.PI/4}
    // minAzimuthAngle={-Math.PI}
    // minPolarAngle={0}
    />
  )
}
export {Orbit};