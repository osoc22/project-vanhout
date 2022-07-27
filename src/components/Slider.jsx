const Slider = (props) => {
    return(
        <div className='slider_container'>
            <p className='slider_current'>Current floor: {props.sliderValue}</p>
            <p>{props.floorCount+1}</p>
            <div className='slider_actual'>
                <input onInput={() => props.sliderToApp(document.getElementById("slider").value)} type="range" min="1" max={props.floorCount+1} id="slider" />
            </div>
            <p>1</p>
        </div>
    )
}

export default Slider;