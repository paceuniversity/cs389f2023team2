import React from 'react'
import '../App.css';
import MovieImage from '../Assets/emptypic.jpg';
import MoviePoster from '../Assets/movieposter.jpg';

import { BiSolidRightArrow } from 'react-icons/bi';

const auth = process.env;

const upcomingUrl = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: '' + auth
  }
};

let path1, path2, path3, path4, path5, path6;

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

        console.log(path1);


        path1 = 'https://image.tmdb.org/t/p/w500' + queue.get(0).poster;
        path2 = 'https://image.tmdb.org/t/p/w500' + queue.get(1).poster;
        path3 = 'https://image.tmdb.org/t/p/w500' + queue.get(2).poster;
        path4 = 'https://image.tmdb.org/t/p/w500' + queue.get(3).poster;
        path5 = 'https://image.tmdb.org/t/p/w500' + queue.get(4).poster;
        path6 = 'https://image.tmdb.org/t/p/w500' + queue.get(5).poster;
    })
    .catch(err => console.error('error:' + err))

const UpcomingMovies = () => {

  return (
    <div className="UpcomingMovies-section-container">
        <div className="UpcomingMovies-text-section-container">
            <center>
            Upcoming Movies <BiSolidRightArrow />
            </center>
            </div>
            <div className="UpcomingMovies-images">
            <img className='MovieImage-size' src={path1} alt=''></img>
            <img className='MovieImage-size'src={path2} alt=''></img>
            <img className='MovieImage-size'src={path3} alt=''></img>
            <img className='MovieImage-size'src={path4} alt=''></img>
            <img className='MovieImage-size'src={path5} alt=''></img>
        </div>
    </div>    
  );
}

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

export default UpcomingMovies