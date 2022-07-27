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

export async function getJsonOfProjects() {
    return await getJsonFromUrl(`https://circl.be/nieuw/tool/model.php?&json`);
}

export async function getJsonByProjectIds(ids) {
    let idString =""
    for (let id of ids) {
        idString += `${id},`
    }

    idString = idString.substring(1, idString.length-1);
    return await getJsonFromUrl(`https://circl.be/nieuw/tool/model.php?project=${ids}&json`);
}

export async function fetchProject(projectId,setProjectJSON) {
    let projectIds = [projectId];
    if (projectId === -1) {
      projectIds = [39,58,31,7,29,34,32,43,38,55,19,56,59,35,8,13,14,15,41]
    };
    let models = await getJsonByProjectIds(projectIds)
    setProjectJSON(models)
}