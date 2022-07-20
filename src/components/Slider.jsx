import React, { Component,useEffect, useState, useMemo,Suspense} from 'react';

export default function Slider(sliderToApp) {
    const data = "3"
    return(
        <div>
            <input type="range" min="1" max="5" className="slider" id="slider" />
            <p className='sliderValue' id='sliderValue'>0</p>
            <button primary onClick={() => sliderToApp(data)}>Click Child</button>
        </div>
    )
}