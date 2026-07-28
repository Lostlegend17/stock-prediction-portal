import React from 'react'
import Button from './Button'

const Main = () => {
  return (

    <>
    <div className='container'>
    <div className='p-5 text-center bg-light-dark rounded'>
        <h1 className='text-light'>Stock Prediction Portal</h1>
        <p className='text-light'>Stock Prediction Portal is a full-stack web application that predicts stock prices using historical market data and machine learning models. It provides interactive dashboards, real-time stock visualizations, and predictive analytics for market trend analysis. The platform is built with React, Django, Bootstrap, and Python, offering users an intuitive interface for exploring stock insights and forecasts.</p>
      
        <Button text='Login' class='btn-outline-info'/>
    </div>
    </div>
</>

)
}

export default Main