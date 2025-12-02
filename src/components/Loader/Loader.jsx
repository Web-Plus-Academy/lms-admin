import React from 'react'
import './Loader.css'
import SWPAlogo from "../../assets/swpalogo.png";

const Loader = () => {
    return (
        <div className="loader-overlay">
            <div className="swpa-loader">
                <img src={SWPAlogo} alt="SWPA Logo" className="loader-logo" />
                <span className="loader-ring"></span>
            </div>
        </div>

    )
}

export default Loader
