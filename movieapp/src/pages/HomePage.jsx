import React from 'react';
import '../App.css';
import { Container } from 'react-bootstrap';
import BannerImage from '../Assets/emptypic.jpg';
import ExampleImage from '../Assets/movieexample.jpg';
import { FiArrowRight } from "react-icons/fi";
// import Navbar from './Navbar';



const Home = () => {
  return (

    <div className="home-container">

      <div classname="home-banner-container" >
        <img className="bigTopPicture" src={ExampleImage} alt="" />
        <div className="home-text-section">
          <h1 className="primary-heading">
            <center>
              Upcoming Movies All in One Place
            </center>
          </h1>

        </div>
        <center>
          <button className="secondary-button">
            Start Here <FiArrowRight />
          </button>
        </center>
      </div>

    </div>

  )
};

export default Home;