import {useFrame} from '@react-three/fiber'
import state from '../CamerState';
import * as THREE from 'three';
import { PerspectiveCamera } from 'three';


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


const CameraControls = ({sizes}) => {
    const camera = new PerspectiveCamera(-2,2,2,-2);
    return(
        null
    )
}



export default CameraControls;