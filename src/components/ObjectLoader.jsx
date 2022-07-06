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

export function LoadObjectsFromJson() {}

// Note: write dynamically so any obj version can be positioned 
export function LoadObjAtPosition() {}

// NOTE: if obj is not found, load based on points => LoadCuboid
export function LoadObjectById() {}

// NOTE: This will create custom cuboid, not from a .obj file
export function LoadCuboid() {}