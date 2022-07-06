import { useLoader } from "@react-three/fiber";
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const BathroomModel_2 = props => {
    const model_2 = useLoader(
       OBJLoader, 
       props.path
    )
    console.log(model_2);
       return (
           <primitive object={model_2} position={[0,0,0]} />
       )
   }
const BathroomModel_color = props => {
    const model_color = useLoader(
       GLTFLoader, 
       props.path
    )
    console.log(model_color);
       return (
           <primitive object={model_color.scene} position={[0,10,0]} />
       )
   }
   
   export {BathroomModel_2, BathroomModel_color};