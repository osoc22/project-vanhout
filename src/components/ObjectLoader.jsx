import React, { Component,useEffect, useState} from 'react';
import { BoxBufferGeometry } from 'three';

export async function getJsonByProjectId(id) {
    // return ["hello"]
    return fetch(`https://circl.be/nieuw/tool/model.php?project=${id}&json`)
    .then((response) => response.json())
    .then((responseJson) => {
    return responseJson;
    })
    .catch((error) => {
    console.error(error);
    });
}

export async function loadObjectsFromJson(projectId) {
    const modelData = await getJsonByProjectId(projectId)
    const latestModelData = modelData[modelData.length-1]
    console.log(latestModelData)
    
    let objects = []
    let object
    let i = 0
    for (let obj of latestModelData.elements) {
        i += 1
        object = loadObj(obj,i)
        if (object) { objects.push(object)}
    }
    return objects;
    //  id
    //  name
    //  parcel
    //  volumes
    //  elements
    //  performance

}

// Note: write dynamically so any obj version can be positioned 
export function loadObj(obj,iter) {
    if (obj.type == "wall") {
        return Cuboid(iter,obj.type,[obj.width/1000,obj.height/1000,obj.depth/1000],[obj.posX/1000,obj.posZ/1000,obj.posY/1000],obj.fill)
    }
}

// NOTE: if obj is not found, load based on points => LoadCuboid
export function loadObjectById() {}

// NOTE: This will create custom cuboid, not from a .obj file

const Cuboid = (iter,type,shape,pos,fill) => {
    return(
      <mesh position={pos} key={`mesh${type}${iter}`}>
        <boxBufferGeometry attach="geometry" args={shape}/>
        <meshBasicMaterial attach="material" color={fill}/>
        <axesHelper args={[5]}/>
      </mesh>
    )
}