import React, { Component,useEffect, useState, useMemo,Suspense} from 'react';

export default function Slider({sliderToApp}) {
    return(
        <div>
            <input type="range" min="1" max="4" className="slider" id="slider" />
            <button onClick={() => sliderToApp(document.getElementById("slider").value)}>Click Child</button>
        </div>
    )
}