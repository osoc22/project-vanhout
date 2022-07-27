# Open Summer Of Code & Project info

This project was made for OSOC 2022 hybrid edition. Open summer of code aims to
make data open, and available for the public. Feel free to fork this repository
or make use of the API calls.

This project uses the open data provided by our partner CIRCL to generate 3D
visuals of houses for a select amount of parcels in Belgium. Rather than loading
a specific model, the houses are modular and the data states the location and
size of where objects have to be loaded.

# API calls & 2D views

The API was provided by CIRCL. It makes use of GEO services of information for Flanders (Geografische informatie over Vlaanderen) to find data about parcels in Flanders, Belgium. The API provides JSON files with data about the parcels,
along with several iterations of house designs fitting the parcels.

To get a 2D view of what the house should look like you may visit following links:

- simplified 2D visualisation of all projects: 
    https://circl.be/nieuw/tool/model.php

- simplified 2D visualisation of specified project: 
    https://circl.be/nieuw/tool/model.php?project=1

For the API calls you can use the following commands:

- json formatted data of all projects:
      getJsonOfProjects()
      gets all models from https://circl.be/nieuw/tool/model.php?json, this will take a few seconds to generate.

- json formatted data of specified project:
      getJsonByProjectId(id)
      gets the specified model from https://circl.be/nieuw/tool/model.php?project=id&json  where id is the specified project.

- json formatted data for multiple projects:
      getJsonByProjectIds(ids)
      gets specified models from https://circl.be/nieuw/tool/model.php?project=id1,id2,id3...&json where the ids specify the projects.

The JSON exports contains an array with one or multiple building variants.
Each variant contains info that can be used for 3D visualisations.

format:
    id: string 
    name: string
    parcel: polygon = list of points (X,Y) for the plot where the building is located. You will have to manually add a Z coordinate. The LoadFloors() method will generate the parcel from the given points.
    volumes: array of polygons with the building volume per level (0 = ground floor, 1 = 1st level...)
    elements: array of building elements containing:
        type: string
        width, depth, height: size of the element as a "box' = all in mm
        posX, posY, posZ: position in absolute (X,Y,Z) coordinates of the element.

        Remember that three.js uses the center point of objects to position them. The implemented solution to this
        is to move the object into a group, and move the group. The object will move accordingly, but can be offset
        by half it's width, height and depth in order to position it based on it's corner instead.

        theta: rotation of the element in (X,Y) plane in radians. 
        This is a second reason for the usage of the group implementation, as rotation is performed on the middle
        of the object. The theta value is however rotating around the corner. By rotating the group, the child object
        will be rotated around it's corner which is located at the center of the group.

        points: describe the absolute coordinates (X,Y,Z) of the polygon describing the object (height = derived from the "height" value).

        Base yourself on the code present in loadCorners() for the implementation details for the coordinates. The 
        normalized points are parsed to getGeometryFromNormalizedPoints(), which will create a <bufferGeometry> component
        which creates the object from the points. This implementation doesn't allow for proper lighting implementation,
        as certain materials cannot be properly applied.

        properties: key-value pairs describing some extra properties for the object.

        stroke & fill: css-value for the colouring of the simplified 2D visualisation. Some values contain alpha values
        that cannot be shown, but these can be filtered out or the fill color may be changed.



# three-react-fiber to load buildings


The project makes use of three-react-fiber, a package that allows you to express Three.js as JSX.
Most objects are <boxBufferGeometry> components with the position and depth data being pulled from
the JSON file. For example, we generate the walls, ground, and ceiling of a chosen house.  There are a few objects that we load as a gltf (gl Transmission Format). These objects are bathrooms, toilets ... It gives a better idea of how your house is laid out and where that which room may be. This is all generated in a canvas of react-three-fiber. 

# React Autosuggest
We installed the React autosuggest package in our project. This is a standard package that makes forms in React easier. For this project we then used react-autosuggest for the initial form where you can enter an address of a parcel you wish to buy. This package is specially designed to make form-handling in React easier.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
### `npm run deploy`
If you are one the Master branch, running this command will build and deploy the project to the gh-pages branch. More specifically, it will put it in the /app folder of that branch. 

More information on deploying React apps to GitHub pages can be found here: [https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/](https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/)

## React

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

