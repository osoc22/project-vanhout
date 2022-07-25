import React, { Component,useEffect, useState, useMemo,Suspense} from 'react';

export default function Slider({sliderToApp}) {
    return(
        <div className='slider_actual'>
            <input onInput={() => sliderToApp(document.getElementById("slider").value)} type="range" min="1" max="4" id="slider" />
        </div>
    )
}