
import React, {useState, useEffect} from 'react';
import '../App.css';
import { Container } from 'react-bootstrap';
import BannerImage from '../Assets/emptypic.jpg';
import ExampleImage from '../Assets/movieexample.jpg';
import { FiArrowRight } from "react-icons/fi";
import BannerBackground from '../Assets/blackgreygradient.jpg';
// import Navbar from './Navbar';
import { BiSolidRightArrow } from 'react-icons/bi';


import MovieQueue from '../util/MovieQueue';
import { Link } from 'react-router-dom';

const upcomingUrl = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';

const auth = process.env.auth;
let todaysDate = new Date().toLocaleDateString().split('/');
todaysDate = [parseInt(todaysDate[0]), parseInt(todaysDate[1]), parseInt(todaysDate[2])];

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: auth
  }
};

const Home = () => {
  const queue = new MovieQueue();

  const [results, setResults] = useState([])
  const [banner, setBanner] = useState('')
  const [title, setTitle] = useState({});

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc`,
        options
      );
      const data = await response.json();
      setTrendingMovies(data.results.slice(0, 5)); 
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, [currentPage]); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPage((prevPage) => prevPage + 1); 
    }, 300000);


    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.gte=' + todaysDate[2] + '-' + todaysDate[0] + '-' + todaysDate[1] + '&sort_by=popularity.desc', options)
        .then(res => res.json())
        .then(json => setResults(json.results))
        .catch(err => console.log(err))
  }, []);

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const releaseDate = result.release_date.split('-');

    if ((parseInt(releaseDate[0]) === 2024 && parseInt(releaseDate[1]) > todaysDate[0] - 6) || parseInt(releaseDate[0]) > 2024) {
      continue;
    }
    const lowercase = result.original_title.replaceAll(' ', '-').toLowerCase() + '-' + releaseDate[0];

    const map = {
      popularity: result.popularity,
      id: result.id,
      title: result.original_title,
      page_title: lowercase,
      description: result.overview,
      release: result.release_date,
      poster: 'https://image.tmdb.org/t/p/original' + result.poster_path,
      backdrop: result.backdrop_path
    };
    queue.enqueue(map);
  }
  // queue.sort();

  useEffect(() => {
    if (banner === '') {
      const random = Math.floor(Math.random() * queue.length);
      const id = queue.get(random) == null ? 0 : queue.get(random).id;
      const title = queue.get(random) == null ? '' : queue.get(random).page_title;

      fetch('https://api.themoviedb.org/3/movie/' + id + '/images?include_image_language=null', options)
        .then(res => res.json())
        .then(json => {
          const breakRandom = Math.floor(Math.random() * json.backdrops.length);
          let index = 0;
          for (let i = 0; i < json.backdrops.length; i++) {
            if (i == breakRandom) {
              index = i;
              break;
            }
          }
          setBanner('https://image.tmdb.org/t/p/w1280' + json.backdrops[index].file_path);
          setTitle(title);
        })
        .catch(err => console.error('error:' + err));
    }
  });

  return (
    <div className="home-container">
      <div className="banner-background">
      <Link to={`/movie/${title}`}>
        <div className="the-banner" style={{backgroundImage: "url(" + banner + ")"}}>
        <h1 className="primary-heading">
            <center>
              Every Movie, Everywhere, All at Once
            </center>
          </h1>
              
        </div>
        
      </Link>
      <Link to="/films"><button class="secondary-button" role="button">Start Here <FiArrowRight /></button></Link>
      </div>


                            

      {/* <div classname="home-banner-container" > */}
      <div className="UpcomingMovies-text-section-container">
              <center>
              <Link className='arrow' to='/films/upcoming'><h4>Upcoming Movies<BiSolidRightArrow /></h4> </Link>
              </center>
              </div>
        <div className="UpcomingMovies-section-container">

              <div className="UpcomingMovies-images">
                  <Link to={`/movie/${queue.get(0) == null ? '' : queue.get(0).page_title}`}>
                      <img className='MovieImage-size' src={queue.get(0) == null ? '' : queue.get(0).poster} alt=''></img>
                  </Link>

                  <Link to={`/movie/${queue.get(1) == null ? '' : queue.get(1).page_title}`}>
                      <img className='MovieImage-size'src={queue.get(1) == null ? '' : queue.get(1).poster} alt=''></img>
                  </Link>

                  <Link to={`/movie/${queue.get(2) == null ? '' : queue.get(2).page_title}`}>
                      <img className='MovieImage-size'src={queue.get(2) == null ? '' : queue.get(2).poster} alt=''></img>
                  </Link>

                  <Link to={`/movie/${queue.get(3) == null ? '' : queue.get(3).page_title}`}>
                      <img className='MovieImage-size'src={queue.get(3) == null ? '' : queue.get(3).poster} alt=''></img>
                  </Link>

                  <Link to={`/movie/${queue.get(4) == null ? '' : queue.get(4).page_title}`}>
                      <img className='MovieImage-size'src={queue.get(4) == null ? '' : queue.get(4).poster} alt=''></img>
                  </Link>

          </div>


      </div>

      <div className="movie-of-the-day-container" style={{backgroundImage: "url(" + 'https://www.themoviedb.org/t/p/w1280/7HR38hMBl23lf38MAN63y4pKsHz.jpg' + ")"}}>
        <div className='content-motd'>
            <Link to={`/movie/past-lives-2023`}>
                <img className='movie-of-the-day-poster'src={'https://image.tmdb.org/t/p/original/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg'} alt=''></img>
            </Link>
            <h1 className='movie-of-the-day-heading'>
                Movie of the Day
            </h1>
            <div className="movie-of-the-day-title">
                <p>{`Past Lives`}</p>
            </div>
            <div className="movie-of-the-day-description">
              <p>{`Nora and Hae Sung, two childhood friends, are reunited in New York for one fateful week as they confront notions of destiny, love, and the choices that make a life.`}</p>
            </div>
        </div>
      </div>

      <div className='trending-movies-title'><center><h4>Trending Movies</h4></center></div>    
       <div className='trending-movies-container'>
       <div className='trending-movies-posters'>
        {trendingMovies.map((movie, index) => (
        <Link key={movie.id} to={`/movie/${movie.page_title}`}>
          <img
            className='MovieImage-size'
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt={`${movie.original_title} Poster`}
          />
        </Link>
      ))}
    </div>


       </div>
      <div>
        <center><span style={{color: "blanchedalmond"}}>© Cinematd. Co-founded by Amer Issa & Pride Yin</span></center>
      </div>
      
    </div>
    
  )
};

const UpcomingMovies = () => {
  const queue = new MovieQueue();
  const results = [];

  const [firstResults, setFirstResults] = useState([])
  const [secondResults, setSecondResults] = useState([])
  const [thirdResults, setThirdResults] = useState([])

  useEffect(() => {
      fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.gte=' + todaysDate[2] + '-' + todaysDate[0] + '-' + todaysDate[1] + '&sort_by=popularity.desc', options)
          .then(res => res.json())
          .then(json => setFirstResults(json.results))
  }, []);

  useEffect(() => {
      fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=2&primary_release_date.gte=' + todaysDate[2] + '-' + todaysDate[0] + '-' + todaysDate[1] + '&sort_by=popularity.desc', options)
          .then(res => res.json())
          .then(json => setSecondResults(json.results))
  }, []);

  useEffect(() => {
      fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=4&primary_release_date.gte=' + todaysDate[2] + '-' + todaysDate[0] + '-' + todaysDate[1] + '&sort_by=popularity.desc', options)
          .then(res => res.json())
          .then(json => setThirdResults(json.results))
  }, []);

  // The rest

  firstResults.forEach(res => results.push(res));
  secondResults.forEach(res => results.push(res));
  thirdResults.forEach(res => results.push(res));

  for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const releaseDate = result.release_date.split('-');

      if ((parseInt(releaseDate[0]) === 2024 && parseInt(releaseDate[1]) > todaysDate[0] - 6) || parseInt(releaseDate[0]) > 2024) {
          continue;
      }
      const lowercase = result.original_title.replaceAll(' ', '-').toLowerCase() + '-' + releaseDate[0];

      const map = {
          title: result.original_title,
          page_title: lowercase,
          description: result.overview,
          release: result.release_date,
          poster: 'https://image.tmdb.org/t/p/original' + result.poster_path,
          backdrop: result.backdrop_path,
          popularity: result.popularity
      };
      queue.enqueue(map);
  }
/*---------------------------------------------*/

  
  // queue.sort();

  // return (
  //     <div className="UpcomingMovies-section-container">
  //         <div className="UpcomingMovies-text-section-container">
  //             <center>
  //             Upcoming Movies <BiSolidRightArrow />
  //             </center>
  //             </div>
  //             <div className="UpcomingMovies-images">
  //                 <Link to={`/movie/${queue.get(0) == null ? '' : queue.get(0).page_title}`}>
  //                     <img className='MovieImage-size' src={queue.get(0) == null ? '' : queue.get(0).poster} alt=''></img>
  //                 </Link>

  //                 <Link to={`/movie/${queue.get(1) == null ? '' : queue.get(1).page_title}`}>
  //                     <img className='MovieImage-size'src={queue.get(1) == null ? '' : queue.get(1).poster} alt=''></img>
  //                 </Link>

  //                 <Link to={`/movie/${queue.get(2) == null ? '' : queue.get(2).page_title}`}>
  //                     <img className='MovieImage-size'src={queue.get(2) == null ? '' : queue.get(2).poster} alt=''></img>
  //                 </Link>

  //                 <Link to={`/movie/${queue.get(3) == null ? '' : queue.get(3).page_title}`}>
  //                     <img className='MovieImage-size'src={queue.get(3) == null ? '' : queue.get(3).poster} alt=''></img>
  //                 </Link>

  //                 <Link to={`/movie/${queue.get(4) == null ? '' : queue.get(4).page_title}`}>
  //                     <img className='MovieImage-size'src={queue.get(4) == null ? '' : queue.get(4).poster} alt=''></img>
  //                 </Link>

  //         </div>
  //     </div>    
  // );
}

export default Home;