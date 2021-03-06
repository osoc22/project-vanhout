import React, {Suspense} from 'react';
import { BufferGeometry, BufferAttribute, DoubleSide} from 'three';
import { GLTFObject } from './GLTFModelLoader';

let colors = {"inner_wall":"#AAAAAA","wall":"#DBD5D0","plane":"#7C827D","parcel":"#81B85C","floor":"#8F7868"}
let floorThickness = 300;
let GLTFObjects = {"bathroom":{"big":{"palleteRed":"/Models/Big_bathroom.gltf"},"small":{"palleteRed":"/Models/Small_bathroom.gltf"}},"toilet":{"big":{"palleteRed":"/Models/Big_WC.gltf"},"small":{"palleteRed":"/Models/Small_WC.gltf"}}}
let selectedColor = "palleteRed";

// get interior object layouts
export function getRandomLayout(modelData) {
    let randomModelId = Math.round(Math.random()*(modelData.length-1));
    return modelData[randomModelId]
}

export function getLatestLayout(modelData) {
    return modelData[modelData.length-1]
}

// loop through json, pull out houses
export function loadBuildingsFromJson(modelData,floor =0) {
    if (!modelData.length) {return;}
    let objects = []
    let nextId = "?";
    let pos = 0;
    for (let i=0; i<modelData.length;i++) {
        const buildingModelData = modelData[i]
        const id = buildingModelData.id.split(".")[0]

        if (modelData.length-1 === i) {
            objects.push(...loadObjectsFromJson(buildingModelData,floor,pos*20))
            continue;
        }

        nextId = modelData[i+1].id.split(".")[0];
        if(nextId === id) {continue;}
        objects.push(...loadObjectsFromJson(buildingModelData,floor,pos*20))
        pos += 1;
    }

    objects.push(getInfinitePlane())
    objects.push(LoadParcel(modelData[0].parcel));
    return objects;
}

// loop through building data, call object loaders
export function loadObjectsFromJson(modelData, floor = 0,extraDistance=0) { 
    const floorCount = getFloorCount(modelData);
    let objects = [];
    let object;
    let obj;

    let corners = [];
    let corner;
    
    for (let i=0;i<modelData.elements.length;i++) {
        obj = modelData.elements[i]
        obj.extraId = modelData.id;
        obj.extraDistance = extraDistance;
        if(floor != 0) {
            if(obj.posZ >= floor*3000) {
                continue
            }
        }
        
        if (obj.type == "corner") {
            corner = loadCorner(obj.points,obj.height,extraDistance)
            objects.push(corner)
            corners.push(obj.points[0])
            continue
        }

        object = loadObj(obj,i);
        if (object) { objects.push(object)}
    }

    objects.push(loadFloors(corners, floorThickness,floorCount,floor >= floorCount+1,extraDistance))
    return objects;
}

// Loads either a GLTF object if available for the given object, otherwise a Cuboid.
export function loadObj(obj,iter) {
    if (["building"].indexOf(obj.type) == -1) {
        if (obj.fill === 'none') {
            return;
        }
        
        const {heightModifier,ZModifier} = setWallModifiers(obj);
        let gltf = loadAsGLTF(obj); 
        if (gltf) { return gltf}

        return Cuboid(`${iter}${obj.extraId}`,obj.type,[obj.width/1000,obj.height/1000+heightModifier/1000,obj.depth/1000],[-obj.posX/1000+obj.extraDistance,obj.posZ/1000+ZModifier/1000,obj.posY/1000],obj.fill,obj.theta)
    }
}

export function loadAsGLTF(obj){
    let gltf;
    for (let objectName in GLTFObjects) {
        if (obj.type === objectName) {
            for (let size in GLTFObjects[objectName]) {
                if ((obj.properties.svg).indexOf(size) !== -1) {
                    //console.log(`found: ${size} for obj ${obj.type}`)
                    return <Suspense fallback={null} >
                                <group position={[-obj.posX/1000,obj.posZ/1000,obj.posY/1000]} rotation={[0,obj.theta,0]}>
                                <GLTFObject path={process.env.PUBLIC_URL + GLTFObjects[objectName][size][selectedColor]} position={[-obj.width/1000/2,0,obj.depth/1000/2]}/>
                                {/* <axesHelper args={[5]}/> */}
                                </group>
                         </Suspense>
                }
            }
            break
        }
    }
    return gltf;

}

export function setWallModifiers(obj) {
    if (obj.type == "wall") {
        obj.fill = colors["wall"];
        if (obj.properties["wall-type"].indexOf("inner") !== -1) {
            obj.fill = colors["inner_wall"];
        }
        return {"heightModifier":0,"ZModifier":0}
    }
    return {"heightModifier":-floorThickness,"ZModifier":10}
}

// get the corner points of the current building.
export function getCorners(modelData,floor) {
    let corners = [];
    let obj;
    for (let i=0;i<modelData.elements.length;i++) {
        obj = modelData.elements[i]
        if(floor != 0) {
            if(obj.posZ >= floor*3000) {
            }
        }
        
        if (obj.type == "corner") {
            corners.push(obj.points[0])
        }
    }
    return corners;
}

// gets the center point of the building
export function getBuildingCenterFromJson(modelData, floor = 0) {
    let corners = getCorners(modelData,floor)

    const cornersByFloor = divideFloors(corners);
    let height = 3000;
    let middleFloor = cornersByFloor[Math.floor(cornersByFloor.length/2)];
    let center = middleFloor[getCenterId(middleFloor)]
    center[2] = cornersByFloor.length/2*height;
    center = [center[0]/1000,center[1]/1000,center[2]/1000]
    
    return center
}

// sets the camera to a corner of a building, facing the center
export function setCameraInCorner(threeCanvas,modelData,cornerId,floor=0) {
    const corners = getCorners(getLatestLayout(modelData),floor)
    const cornersByFloor = divideFloors(corners);
    let corner = cornersByFloor[floor][cornerId%cornersByFloor[floor].length]
    corner = [corner[0]/1000,corner[1]/1000,(corner[2]+1500)/1000]

    console.log(corner)
    threeCanvas.camera.position.set(corner[0],corner[1],corner[2])
    
    const center = cornersByFloor[floor][getCenterId(cornersByFloor[floor])] 
    threeCanvas.camera.lookAt(center[0]/1000,center[1]/1000,center[2]/1000)
    threeCanvas.renderer.render(threeCanvas.scene,threeCanvas.camera)
}

// creates a buffergeometry from the given points 
export function getGeometryFromNormalizedPoints(normalizedPoints) {
    let positions = [];

    for (let i = 0; i< normalizedPoints.length;i++) {
        const polygon = normalizedPoints[i]
        positions.push(-polygon[0]/1000)
        positions.push(polygon[2]/1000)
        positions.push(polygon[1]/1000)
    }

    const geometry = new BufferGeometry();
    const positionNumComponents = 3;
    geometry.setAttribute(
        'position',
        new BufferAttribute(new Float32Array(positions), positionNumComponents))
    return geometry
}

export function addHeight(point,height) {
    return [point[0],point[1],point[2]+height]
}

// create a corner object from the 2D points
export function loadCorner(points,height,extraDistance){
    let normalizedPoints = []
    
    for (let i = 0;i < points.length-1; i++) {
        // draw triangle (bottom)
        normalizedPoints.push(points[0])
        normalizedPoints.push(points[i])
        normalizedPoints.push(points[i+1])

        // draw triangle (top)
        normalizedPoints.push(addHeight(points[0],height))
        normalizedPoints.push(addHeight(points[i],height))
        normalizedPoints.push(addHeight(points[i+1],height))

        // draw side triangle (bottom)
        normalizedPoints.push(points[i])
        normalizedPoints.push(addHeight(points[i],height))
        normalizedPoints.push(points[i+1])

        // draw side triangle (top)
        normalizedPoints.push(addHeight(points[i],height))
        normalizedPoints.push(addHeight(points[i+1],height))
        normalizedPoints.push(points[i+1])
    }

    let geometry = getGeometryFromNormalizedPoints(normalizedPoints)
    return <mesh geometry={geometry} position={[extraDistance,0,0]}><meshBasicMaterial attach="material" color={colors["wall"]} side={DoubleSide}/></mesh> 
}

// divide corners into arrays of floors
export function divideFloors(points) {
    let cornersByFloor = []
    let floorHeight = points[0][2];
    let currentFloor = [];

    for(let point of points) {
        if(point[2] < floorHeight+3000) {
            point[2] = floorHeight
            currentFloor.push(point);
            if(point == points[points.length-1]) {
                cornersByFloor.push(currentFloor);
            }
            continue;
        }

        cornersByFloor.push(currentFloor);
        currentFloor = [point]
        floorHeight = point[2];
    }
    return cornersByFloor
}

export function getFloorCount(modelData) {
    let corners = getCorners(modelData)
    return divideFloors(corners).length;
}

// get the highest floor count of multiple buildings
export function getHighestFloorCount(modelData) {
    let highestfloorCount =0;

    for (let buildingModelData of modelData){
        let corners = getCorners(buildingModelData)
        highestfloorCount = Math.max(divideFloors(corners).length,highestfloorCount)
    }
    return highestfloorCount
}

// get the index of the corner closest to the centerpoint of the current floor
export function getCenterId(floor) {
    let totalX = 0;
    let totalY = 0;

    for(let point of floor) {
        totalX += point[0];
        totalY += point[1];
    }

    const averageX = totalX/floor.length;
    const averageY = totalY/floor.length;
    let distance = Math.abs(averageX - floor[0][0]) + Math.abs(averageY - floor[0][1]);
    let center = 0;

    for(let i = 1; i < floor.length; i++) {
        let tempDistance = Math.abs(averageX - floor[i][0]) + Math.abs(averageY - floor[i][1]);
        if(tempDistance < distance) {
            distance = tempDistance;
            center = i;
        }
    }

    return center
}

// load the floor for every level, add a roof if the max height is reached. Created from points.
export function loadFloors(corners, height,floorCount,drawRoof,extraDistance) {
    let cornersByFloor = divideFloors(corners);
    let center;
    let normalizedPoints = [];

    for(let floor of cornersByFloor) {
        center = getCenterId(floor);
        
        for(let i = 0; i < floor.length; i++) {
            let nextCorner = i+1
            if(i == floor.length-1) {
                nextCorner = 0;
            }

            // draw triangle (top) (floor)
            normalizedPoints.push(floor[center]);
            normalizedPoints.push(floor[i]);
            normalizedPoints.push(floor[nextCorner]);

            if(floor !== cornersByFloor[0]) {
                // draw triangle (bottom) (floor)
                normalizedPoints.push(addHeight(floor[center],-height))
                normalizedPoints.push(addHeight(floor[i],-height))
                normalizedPoints.push(addHeight(floor[nextCorner],-height))
            }
            
            if(cornersByFloor.length === floorCount && drawRoof) {
                // draw triangle (top) (roof)
                normalizedPoints.push(addHeight(floor[center],3000));
                normalizedPoints.push(addHeight(floor[i],3000));
                normalizedPoints.push(addHeight(floor[nextCorner],3000));

                // draw triangle (bottom) (roof)
                normalizedPoints.push(addHeight(floor[center],-height+3000))
                normalizedPoints.push(addHeight(floor[i],-height+3000))
                normalizedPoints.push(addHeight(floor[nextCorner],-height+3000))
            }
        }
    }

    let geometry = getGeometryFromNormalizedPoints(normalizedPoints);
    return <mesh geometry={geometry} position={[extraDistance,0,0]}><meshBasicMaterial attach="material" side={DoubleSide} color={colors["floor"]}/></mesh>
}

// loads the parcel under the building(s). Created from points.
export function LoadParcel(points) {
    let vectorizedPoints = []
    for (let point of points) {
        vectorizedPoints.push([point[0],point[1],-20])
    }

    let center = getCenterId(vectorizedPoints);
    let normalizedPoints = [];
    for(let i = 0; i < vectorizedPoints.length; i++) {
        let nextCorner = i+1
        if(i == vectorizedPoints.length-1) {
            nextCorner = 0;
        }

        normalizedPoints.push(vectorizedPoints[center]);
        normalizedPoints.push(vectorizedPoints[i]);
        normalizedPoints.push(vectorizedPoints[nextCorner]);
    }
    let geometry = getGeometryFromNormalizedPoints(normalizedPoints);
    // return <mesh geometry={geometry}><meshBasicMaterial attach="material" side={DoubleSide} color={"#4F7B22"}/></mesh>;
    return <mesh geometry={geometry}><meshBasicMaterial attach="material" side={DoubleSide} color={colors["parcel"]}/></mesh>;
}

// loads a "plane" under the floor
export function getInfinitePlane() {
    return Cuboid(2,"plane",[10000,1.6,10000],[5000,-2,-5000],colors["plane"],0)
}

// NOTE: This will create custom cuboid, not from a .obj file
const Cuboid = (iter,type,shape,pos,fill,theta) => {
    return(
    <group key={`pivot${type}${iter}${fill}`} position={pos} rotation={[0,theta,0]}>
        <mesh key={`mesh${type}${iter}${fill}`} position={[-shape[0]/2,shape[1]/2,shape[2]/2]}>
            <boxBufferGeometry attach="geometry" args={shape}/>
            <meshBasicMaterial attach="material" color={fill}/>
            {/* <axesHelper args={[5]}/> */}
        </mesh>
        {/* <axesHelper args={[5]}/> */}
    </group>)   
}