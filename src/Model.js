import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const BathroomModel_color = props => {
    const model_color = useLoader(
       GLTFLoader, 
       props.path
    )
    console.log(model_color);
       return (
           <primitive object={model_color.scene} position={[0,0,0]} />
       )
   }
   
   export {BathroomModel_color};