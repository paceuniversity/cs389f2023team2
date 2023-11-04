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

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: '' + auth
  }
};

let banner;

const Home = () => {
  const [results, setResults] = useState([])

  useEffect(() => {
    fetch(upcomingUrl, options)
      .then(res => res.json())
      .then(json => {
        const results = json.results;
        const queue = new MovieQueue();

        for (let i = 0; i < results.length; i++) {
            const result = results[i];

            const date = result.release_date.split('-');

            if (parseInt(date[1]) > 10 && parseInt(date[0]) > 2022) {
                const map = {
                    id: result.id,
                    title: result.original_title,
                    description: result.overview,
                    release: result.release_date,
                    poster: result.poster_path,
                    backdrop: result.backdrop_path,
                    popularity: result.popularity
                };
                queue.enqueue(map);
                // queue.setPopularity(result.popularity);
            }
        }
        // queue.sort();
        
        // path1 = 'https://image.tmdb.org/t/p/w500' + queue.get(1).backdrop;

        fetch('https://api.themoviedb.org/3/movie/' + queue.get(1).id + '/images', options)
          .then(res => res.json())
          .then(json => {
            for (let i = 0; i < json.backdrops.length; i++) {
              banner = 'https://image.tmdb.org/t/p/w1280' + json.backdrops[i].file_path;
              setResults(banner);
            }
          })
          .catch(err => console.error('error:' + err));
        })
      .catch(err => console.error('error:' + err))
  }, []);

  return (
    <div className="home-container">
      <img className="banner-background" src={ BannerBackground } alt=""></img>
      <div classname="home-banner-container" >
        <center>
          {console.log('should banner')}
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
  get(position) {
      return this.elements[position];
  }
  clear() {
      while (!this.isEmpty) {
          this.elements.shift()
      }
  }
  setPopularity(popularity) {
      this.popularity = popularity;
  }
  sort() {
      this.elements = this.elements.sort((movie1, movie2) => {
          if (movie2.popularity < movie1.popularity) {
              return 1;
          } else if (movie2.popularity > movie1.popularity) {
              return - 1;
          } else {
              return 0;
          }
      })
  }
  get length() {
      return this.elements.length;
  }
  get isEmpty() {
      return this.elements.length === 0;
  }
}

export default Home;