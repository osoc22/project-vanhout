import React, { Component,useEffect, useState, useMemo} from 'react';
import { BufferGeometry, BufferAttribute, MeshBasicMaterial,DoubleSide} from 'three';

let wallcolor = "#777777";

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
    const latestModelData = modelData[randomModel]
    console.log(modelData)
    console.log(randomModel)
    
    let objects = [];
    let object;
    let obj;

    //objects.push(LoadParcel(latestModelData.parcel));

    for (let i=0;i<latestModelData.elements.length;i++) {
        obj = latestModelData.elements[i]
        object = loadObj(obj,i);

        if (object) { objects.push(object)}
    }
    return objects;
}

// Note: write dynamically so any obj version can be positioned 
export function loadObj(obj,iter) {
    if (["building"].indexOf(obj.type) == -1) {
        if (obj.fill === 'none') {
            //return;
            obj.fill = "#555555"
            obj.height = 1}
        if (obj.type == "corner") { return loadCorner(obj.points,obj.height)}
        if (obj.type == "wall" && obj.properties["wall-type"] == "open") {obj.fill = wallcolor}
        return Cuboid(iter,obj.type,[obj.width/1000,obj.height/1000,obj.depth/1000],[-obj.posX/1000,obj.posZ/1000,obj.posY/1000],obj.fill,obj.theta)
    }
}

// NOTE: if obj is not found, load based on points => LoadCuboid
export function loadObjectById() {}


export function loadCorner(points,height){
    let vertices = []
    let normalizedPoints = []

    for (let i = 0;i < points.length-1; i++) {
        normalizedPoints.push(points[0])
        normalizedPoints.push(points[i])
        normalizedPoints.push(points[i+1])

        normalizedPoints.push([points[0][0],points[0][1],points[0][2]+height])
        normalizedPoints.push([points[i][0],points[i][1],points[i][2]+height])
        normalizedPoints.push([points[i+1][0],points[i+1][1],points[i+1][2]+height])

        normalizedPoints.push([points[i][0],points[i][1],points[i][2]])
        normalizedPoints.push([points[i][0],points[i][1],points[i][2]+height])
        normalizedPoints.push([points[i+1][0],points[i+1][1],points[i+1][2]])

        normalizedPoints.push([points[i][0],points[i][1],points[i][2]+height])
        normalizedPoints.push([points[i+1][0],points[i+1][1],points[i+1][2]])
        normalizedPoints.push([points[i+1][0],points[i+1][1],points[i+1][2]+height])
    }

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
        new BufferAttribute(new Float32Array(positions), positionNumComponents));
    
    return <mesh geometry={geometry}><meshBasicMaterial attach="material" side={DoubleSide} color={wallcolor}/></mesh>
}

export function LoadParcel(points) {
    let vertices = []
    for (let polygon of points) {
        vertices.push([polygon[0]/1000,0,polygon[1]/1000])
    }
   
    const positions = [];
    for (const vertex of vertices) {
        positions.push(...vertex);
    }

    const geometry = new BufferGeometry();
    const positionNumComponents = 3;
    geometry.setAttribute(
        'position',
        new BufferAttribute(new Float32Array(positions), positionNumComponents));
    
    return <mesh geometry={geometry}></mesh>
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

