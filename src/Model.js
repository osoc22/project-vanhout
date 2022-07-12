import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const BathroomModel_Big= props => {
    const model_color = useLoader(
       GLTFLoader, 
       props.path
    )
       return (
           <primitive object={model_color.scene} position={[0,0,0]} />
       )
   }
   
   export {BathroomModel_Big};