import React, {useState, useEffect} from 'react'
import '../App.css';
import MovieImage from '../Assets/emptypic.jpg';
import MoviePoster from '../Assets/movieposter.jpg';

import { BiSolidRightArrow } from 'react-icons/bi';

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

const UpcomingMovies = () => {
    const queue = new MovieQueue();
    const results = [];

    const [firstResults, setFirstResults] = useState([])
    const [secondResults, setSecondResults] = useState([])
    const [thirdResults, setThirdResults] = useState([])

    useEffect(() => {
        fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1', options)
            .then(res => res.json())
            .then(json => setFirstResults(json.results))
    }, []);

    useEffect(() => {
        fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=2', options)
            .then(res => res.json())
            .then(json => setSecondResults(json.results))
    }, []);

    useEffect(() => {
        fetch('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=3', options)
            .then(res => res.json())
            .then(json => setThirdResults(json.results))
    }, []);

    // The rest

    firstResults.forEach(res => results.push(res));
    secondResults.forEach(res => results.push(res));
    thirdResults.forEach(res => results.push(res));

    for (let i = 0; i < results.length; i++) {
        const result = results[i];

        const date = result.release_date.split('-');
        const month = date[1], day = date[2], year = date[0];

        if (parseInt(month) >= parseInt(todaysDate[0]) && parseInt(day) > parseInt(todaysDate[1]) && parseInt(year) >= parseInt(todaysDate[2])) {
            const map = {
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

    return (
        <div className="UpcomingMovies-section-container">
            <div className="UpcomingMovies-text-section-container">
                <center>
                Upcoming Movies <BiSolidRightArrow />
                </center>
                </div>
                <div className="UpcomingMovies-images">
                <img className='MovieImage-size' src={queue.get(0) == null ? '' : queue.get(0).poster} alt=''></img>
                <img className='MovieImage-size'src={queue.get(1) == null ? '' : queue.get(1).poster} alt=''></img>
                <img className='MovieImage-size'src={queue.get(2) == null ? '' : queue.get(2).poster} alt=''></img>
                <img className='MovieImage-size'src={queue.get(3) == null ? '' : queue.get(3).poster} alt=''></img>
                <img className='MovieImage-size'src={queue.get(4) == null ? '' : queue.get(4).poster} alt=''></img>

            </div>
        </div>    
    );
}

export default UpcomingMovies