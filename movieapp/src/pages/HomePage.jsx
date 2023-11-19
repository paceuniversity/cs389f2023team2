import React, {useState, useEffect} from 'react';
import '../App.css';
import { Container } from 'react-bootstrap';
import BannerImage from '../Assets/emptypic.jpg';
import ExampleImage from '../Assets/movieexample.jpg';
import { FiArrowRight } from "react-icons/fi";
import BannerBackground from '../Assets/blackgreygradient.jpg';
// import Navbar from './Navbar';

import MovieQueue from '../util/MovieQueue';
import { Link } from 'react-router-dom';

const upcomingUrl = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';

const auth = process.env;
let todaysDate = new Date().toLocaleDateString().split('/');
todaysDate = [parseInt(todaysDate[0]), parseInt(todaysDate[1]), parseInt(todaysDate[2])];

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: '' + auth
  }
};

const Home = () => {
  const queue = new MovieQueue();

  const [results, setResults] = useState([])
  const [banner, setBanner] = useState('')
  const [title, setTitle] = useState({});

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
      id: result.id,
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
      <img className="banner-background"></img>
      <Link to={`/movie/${title}`}>
        <div className="thebanner" style={{backgroundImage: "url(" + banner + ")"}}></div>
      </Link>
      <div classname="home-banner-container" >
        <h1 className="primary-heading">
            <center>
              Every Movie, Everywhere, All at Once
            </center>
          </h1>
          <center>
          <button className="secondary-button">
            Start Here <FiArrowRight />
          </button>
        </center>
        
        {/* <center>
          <button className="secondary-button">
            Start Here <FiArrowRight />
          </button>
        </center> */}
      </div>
    </div>
  )
};

export default Home;