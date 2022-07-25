const Slider = (props) => {
    return(
        <div className='slider_actual'>
            <input onInput={() => props.sliderToApp(document.getElementById("slider").value)} type="range" min="1" max={props.max} id="slider" />
        </div>
    )
}

export default Slider;