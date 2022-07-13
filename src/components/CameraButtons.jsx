import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
const CameraButtons = ({}) => {
    return(
    <>
        <div id="top">
        
        </div>
        <div id="left">
        <FontAwesomeIcon icon={faCoffee} />
        </div>

        <div id="right">
                {'>'}
        </div>
        <div id="back">
            {''}
        </div>
    </>
    )
}
export default CameraButtons;