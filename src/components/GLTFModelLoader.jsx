import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


const GLTFObject = props => {
    const model = useLoader(
       GLTFLoader, 
       props.path
    )
    // console.log(model.scene)
    model.scene.scale.set(0.25,0.25,0.25);
    return (
        <primitive object={model.scene} position={props.position}/>
    )
}

export {GLTFObject};