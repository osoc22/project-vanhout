import React, { Component,useEffect, useState} from 'react';

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
    const latestModelData = modelData[modelData.length-1]
    // console.log(latestModelData)
    
    let objects = []
    let object
    let i = 0

    // return [
    //     TestCuboid(1,"test",[5,90,10],[5,10,0]),
    //     TestCuboid(1,"test",[5,90,10],[5,10,40])
    
    // ] // [width, height, depth], [x,y,z]

    for (let obj of latestModelData.elements) {
        i += 1
        object = loadObj(obj,i)
        if (object) { objects.push(object)}
    }
    return objects;
}

// Note: write dynamically so any obj version can be positioned 
export function loadObj(obj,iter) {
    if (obj.type != "building" && obj.fill != "none") {
        if (obj.type == "wall" && obj.properties["wall-type"] == "open") {obj.fill = "#885511"}
        return Cuboid(iter,obj.type,[obj.width/1000,obj.height/1000,obj.depth/1000],[obj.posX/1000,obj.posZ/1000,obj.posY/1000],obj.fill,obj.theta)
    }
}

// NOTE: if obj is not found, load based on points => LoadCuboid
export function loadObjectById() {}

// NOTE: This will create custom cuboid, not from a .obj file

const Cuboid = (iter,type,shape,pos,fill,theta) => {
    //  rotation={[0,theta * 180 / Math.PI, 0]}
    //let pivot = <boxBufferGeometry position={[pos[0]-shape[0]/2,pos[1]-shape[1]/2,pos[2]-shape[2]/2]}/>

    // const ref = useUpdate(group => {
    //     group.rotateX(theta * 180 / Math.PI)
    // }, [])

    return(
        <group position={pos} rotation={[0,-theta,0]}>
            <mesh key={`mesh${type}${iter}${fill}`} position={[shape[0]/2,shape[1]/2,shape[2]/2]}>
                <boxBufferGeometry attach="geometry" args={shape}/>
                <meshBasicMaterial attach="material" color={fill}/>
                {/* <axesHelper args={[5]}/> */}
            </mesh>
            {/* <axesHelper args={[5]}/> */}
        </group>
    )
}
