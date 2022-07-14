import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
const CameraButtons = ({}) => {
    return(
    <>
        <div id="top">
        <FontAwesomeIcon icon={faCoffee} />
        </div>
        <div id="left">
        <FontAwesomeIcon icon={faCoffee} />
        </div>

        <div id="right">
        <FontAwesomeIcon icon={faCoffee} />
        </div>
        <div id="back">
        <FontAwesomeIcon icon={faCoffee} />
        </div>
    </>
    )
}
export default CameraButtons;