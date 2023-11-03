import React from 'react'
import '../App.css';
import MovieImage from '../Assets/emptypic.jpg';
import MoviePoster from '../Assets/movieposter.jpg';

import { BiSolidRightArrow } from 'react-icons/bi';

const UpcomingMovies = () => {
  return (
    <div className="UpcomingMovies-section-container">
        <div className="UpcomingMovies-text-section-container">
            <center>
            Upcoming Movies <BiSolidRightArrow />
            </center>
            </div>
            <div className="UpcomingMovies-images">
            <img className='MovieImage-size' src={MoviePoster} alt=''></img>
            <img className='MovieImage-size'src={MoviePoster} alt=''></img>
            <img className='MovieImage-size'src={MoviePoster} alt=''></img>
            <img className='MovieImage-size'src={MoviePoster} alt=''></img>
            <img className='MovieImage-size'src={MoviePoster} alt=''></img>
            <img className='MovieImage-size'src={MoviePoster} alt=''></img>


        </div>

        
    </div>

    
  )
}

export default UpcomingMovies