import React, { Component,useEffect, useState, useMemo,Suspense} from 'react';
import { BufferGeometry, BufferAttribute, DoubleSide,TextureLoader} from 'three';
import { GLTFObject } from './GLTFModelLoader';

let wallcolor = "#AAAAAA";
let floorThickness = 300;
let GLTFObjects = {
    "bathroom":{"big":{"palleteRed":"/Models/Big_bathroom.gltf"},"small":{"palleteRed":"/Models/Small_bathroom.gltf"}},
    "toilet":{"big":{"palleteRed":"/Models/Big_WC.gltf"},"small":{"palleteRed":"/Models/Small_WC.gltf"}}
}
let selectedColor = "palleteRed";

export async function getJsonFromUrl(url) {
    return fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
    return responseJson;
    })
    .catch((error) => {
    console.error(error);
    });   
}

export async function getJsonByProjectId(id) {
    return await getJsonFromUrl(`https://circl.be/nieuw/tool/model.php?project=${id}&json`);
}

export async function getPossibleAddresses(street = undefined,number = undefined,postcode = undefined,city = undefined) {
    let json = await getJsonFromUrl(`https://circl.be/nieuw/tool/overzicht.php?lijst=projecten&type=json`);
    let possiblePlots = []
    for (let plotData of json) {
        let splitAddress = plotData.adres.toLowerCase().split(" ")
        if ((street == undefined) || splitAddress[0].includes(street.toLowerCase())) {possiblePlots.push(plotData); continue;}
        if ((street == undefined) || splitAddress[0].includes(street.toLowerCase())) {possiblePlots.push(plotData); continue;}
    }
    return possiblePlots
}

export async function getJsonByAddressParameters() {

}

export async function loadObjectsFromJson(projectId) {
    // let possibleAddresses = await getPossibleAddresses("Kortrij")
    // for (let addr of possibleAddresses) {
    //     console.log(addr)
    // }

    const modelData = await getJsonByProjectId(projectId)
    let randomModel = Math.round(Math.random()*(modelData.length-1));
    const latestModelData = modelData[modelData.length-1]//modelData[randomModel]
    console.log(modelData)
    console.log(randomModel)
    
    let objects = [];
    let object;
    let obj;
    let corners = [];
    let corner;

    //object.push(<mesh><Plane></Plane></mesh>)
    objects.push(LoadParcel(latestModelData.parcel));

    for (let i=0;i<latestModelData.elements.length;i++) {
        obj = latestModelData.elements[i]
        if (obj.type == "corner") {
            corner = loadCorner(obj.points,obj.height)
            objects.push(corner)
            corners.push(obj.points[0])
            continue
        }
        object = loadObj(obj,i);
        if (object) { objects.push(object)}
    }
    objects.push(loadFloors(corners, floorThickness))
    return objects;
}

// Note: write dynamically so any obj version can be positioned 
export function loadObj(obj,iter) {
    if (["building"].indexOf(obj.type) == -1) {
        if (obj.fill === 'none') {
            return;
            obj.fill = "#555555"
            obj.height = 1}
        
        if (obj.type == "wall") {
            obj.fill = wallcolor
        } else {
            obj.height -= floorThickness;
            obj.posZ += 10;
        }

        let gltf = loadAsGLTF(obj); 
        if (gltf) { return gltf}

        return Cuboid(iter,obj.type,[obj.width/1000,obj.height/1000,obj.depth/1000],[-obj.posX/1000,obj.posZ/1000,obj.posY/1000],obj.fill,obj.theta)
    }
}

export function loadAsGLTF(obj){
    let gltf;
    for (let objectName in GLTFObjects) {
        if (obj.type === objectName) {
            for (let size in GLTFObjects[objectName]) {
                if ((obj.properties.svg).indexOf(size) !== -1) {
                    console.log(`found: ${size} for obj ${obj.type}`)
                    return <Suspense fallback={null} >
                                <group position={[-obj.posX/1000,obj.posZ/1000,obj.posY/1000]} rotation={[0,obj.theta,0]}>
                                <GLTFObject path={GLTFObjects[objectName][size][selectedColor]} position={[-obj.width/1000/2,0,obj.depth/1000/2]}/>
                                {/* <axesHelper args={[5]}/> */}
                                </group>
                         </Suspense>
                }
            }
            //let ref = GLTFobjects.objectName[]
            break
        }
    }
    return gltf;

}

export function getGeometryFromNormalizedPoints(normalizedPoints) {
    let vertices = [];

    for (let i = 0; i< normalizedPoints.length;i++) {
        let polygon = normalizedPoints[i]
        vertices.push([-polygon[0]/1000,polygon[2]/1000,polygon[1]/1000])
    }
   
    const positions = [];
    for (const vertex of vertices) {
        positions.push(...vertex);
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

export function loadCorner(points,height){
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
        normalizedPoints.push(points[i+1])
        normalizedPoints.push(addHeight(points[i+1],height))
    }

    let geometry = getGeometryFromNormalizedPoints(normalizedPoints)
    //const texture = Texture("./Textures/texture.jpg");
    // texture = useLoader(TextureLoader, "/Textures/texture.jpg")
    return <mesh geometry={geometry}><meshBasicMaterial attach="material" side={DoubleSide} color={wallcolor}/></mesh>
}

export function divideFloors(points) {
    let cornersByFloor = []
    let floorHeight = 0;
    let currentFloor = [];

    for(let point of points) {
        if(point[2] == floorHeight) {
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

export function getOptimalPoint(floor) {
    let totalX = 0;
    let totalY = 0;

    for(let point of floor) {
        totalX += point[0];
        totalY += point[1];
    }

    const averageX = totalX/floor.length;
    const averageY = totalY/floor.length;
    let distance = Math.abs(averageX - floor[0][0]) + Math.abs(averageY - floor[0][1]);
    let optimalPoint = 0;

    for(let i = 1; i < floor.length; i++) {
        let tempDistance = Math.abs(averageX - floor[i][0]) + Math.abs(averageY - floor[i][1]);
        if(tempDistance < distance) {
            distance = tempDistance;
            optimalPoint = i;
        }
    }

    return optimalPoint
}

export function loadFloors(points, height) {
    let cornersByFloor = divideFloors(points);

    let optimalPoint;
    let normalizedPoints = [];

    for(let floor of cornersByFloor) {
        optimalPoint = getOptimalPoint(floor);
        
        for(let i = 0; i < floor.length; i++) {
            let nextCorner = i+1
            if(i == floor.length-1) {
                nextCorner = 0;
            }

            // draw triangle (top) (floor)
            normalizedPoints.push(floor[optimalPoint]);
            normalizedPoints.push(floor[i]);
            normalizedPoints.push(floor[nextCorner]);

            // draw triangle (bottom) (floor)
            normalizedPoints.push(addHeight(floor[optimalPoint],-height))
            normalizedPoints.push(addHeight(floor[i],-height))
            normalizedPoints.push(addHeight(floor[nextCorner],-height))

            // draw triangle (top) (roof)
            normalizedPoints.push(addHeight(floor[optimalPoint],3000));
            normalizedPoints.push(addHeight(floor[i],3000));
            normalizedPoints.push(addHeight(floor[nextCorner],3000));

            // draw triangle (bottom) (roof)
            normalizedPoints.push(addHeight(floor[optimalPoint],-height+3000))
            normalizedPoints.push(addHeight(floor[i],-height+3000))
            normalizedPoints.push(addHeight(floor[nextCorner],-height+3000))
        }
    }

    let geometry = getGeometryFromNormalizedPoints(normalizedPoints);
    return <mesh geometry={geometry}><meshBasicMaterial attach="material" side={DoubleSide} color={"#333333"}/></mesh>
}

export function LoadParcel(points) {
    let vectorizedPoints = []
    for (let point of points) {
        vectorizedPoints.push([point[0],point[1],0-1])
    }

    let optimalPoint = getOptimalPoint(vectorizedPoints);
    let normalizedPoints = [];
    for(let i = 0; i < vectorizedPoints.length; i++) {
        let nextCorner = i+1
        if(i == vectorizedPoints.length-1) {
            nextCorner = 0;
        }

        normalizedPoints.push(vectorizedPoints[optimalPoint]);
        normalizedPoints.push(vectorizedPoints[i]);
        normalizedPoints.push(vectorizedPoints[nextCorner]);
    }
    let geometry = getGeometryFromNormalizedPoints(normalizedPoints);
    return <mesh geometry={geometry}><meshBasicMaterial attach="material" side={DoubleSide} color={"#408010"}/></mesh>;
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
        </group>
    )
}

const Texture = (url) => {
    console.log(url)
    const texture = new TextureLoader().load("Textures/texture.png")
    return texture
}