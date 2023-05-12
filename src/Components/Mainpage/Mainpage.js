import { Carousel } from 'antd';
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './Style.css'

const Mainpage = () => {
    
    const contentStyle = {
        height: "600px",
        color: "#093738",
        lineHeight: "80%",
        textAlign: "center",
        backgroundSize: "cover",
    };

    return (
        <React.Fragment>
            <Carousel autoplay className='my-carousel'>
                <div>
                    <p className='carousel-slip-1'>Кто мы?</p>
                </div>
                <div>
                    <p className='carousel-slip-2'>Не знаем</p>
                </div>
                <div>
                    <p className='carousel-slip-3'>Зачем мы здесь?</p>
                </div>
                <div>
                    <p className='carousel-slip-4'>Не знаем</p>
                </div>
            </Carousel>
        </React.Fragment>
    )
}
export default Mainpage