import React, {useState, useEffect} from 'react';
import '../App.css';
import { Container } from 'react-bootstrap';
import BannerImage from '../Assets/emptypic.jpg';
import ExampleImage from '../Assets/movieexample.jpg';
import { FiArrowRight } from "react-icons/fi";
import BannerBackground from '../Assets/blackbluegradient.jpg';
// import Navbar from './Navbar';

const upcomingUrl = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';

const auth = process.env;
const todaysDate = new Date().toLocaleDateString().split('/');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: '' + auth
  }
};

class MovieQueue {
  constructor() {
      this.elements = [];
  }
  enqueue(element) {
      this.elements.push(element);
  }
  dequeue() {
      return this.elements.shift();
  }
  peek() {
      return this.elements[0];
  }
  queue() {
      return this.elements;
  }
  remove(position) {
      return this.elements.splice(position, 1);
  }
  sort() {
      this.elements.sort((movie1, movie2) => {
          return movie2.popularity - movie1.popularity;
      });
  }
  get(position) {
      return this.elements[position];
  }
  clear() {
      while (!this.isEmpty) {
          this.elements.shift()
      }
  }
  get length() {
      return this.elements.length;
  }
  get isEmpty() {
      return this.elements.length === 0;
  }
}

const Home = () => {
  const queue = new MovieQueue();

  const [results, setResults] = useState([])
  const [banner, setBanner] = useState('')

  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
        .then(res => res.json())
        .then(json => setResults(json.results))
        .catch(err => console.log(err))
  }, []);

  for (let i = 0; i < results.length; i++) {
    const result = results[i];

    const date = result.release_date.split('-');
    const month = date[1], day = date[2], year = date[0];

    if (parseInt(month) >= parseInt(todaysDate[0]) && parseInt(day) > parseInt(todaysDate[1]) && parseInt(year) >= parseInt(todaysDate[2])) {
        const map = {
          id: result.id,
          title: result.original_title,
          description: result.overview,
          release: result.release_date,
          poster: 'https://image.tmdb.org/t/p/original' + result.poster_path,
          backdrop: result.backdrop_path,
          popularity: result.popularity
        };
        queue.enqueue(map);
    }
  }
  queue.sort();

  useEffect(() => {
    const random = Math.floor(Math.random() * queue.length);
    const id = queue.get(random) == null ? 0 : queue.get(random).id;

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
        setBanner('https://image.tmdb.org/t/p/w1280' + json.backdrops[0].file_path);
      })
      .catch(err => console.error('error:' + err));
  });

  return (
    <div className="home-container">
      <img className="banner-background" src={ BannerBackground } alt=""></img>
      <div classname="home-banner-container" >
        <center>
          <img className="bigTopPicture" src={banner} alt="" />
        </center>
        <h1 className="primary-heading">
            <center>
              Upcoming Movies All in One Place
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