import React, { useState, useEffect } from "react";
import MovieQueue from '../util/MovieQueue';
import './movie.css'
import StarIcon from '@mui/icons-material/Star';

var storage = require('../storage/members.json');
let json = JSON.parse(JSON.stringify(storage));

const auth = process.env;

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: ''
    }
};

function Movie() {
    const href = window.location.href;

    let query = '';
    let year = '';

    for (let i = href.length - 1; i >= 0; --i) {
        if (href.charAt(i) === '/') {
            break;
        }
        query += href.charAt(i);
    }
    for (let j = 0; j < 4; j++) {
        year += query.charAt(j);
    }
    query = query.substring(5, query.length).split('').reverse().join('');
    year = year.split('').reverse().join('');

    query = query.replaceAll('-', '%20');

    const queryUrl = 'https://api.themoviedb.org/3/search/movie?query=' + query + '&include_adult=false&language=en-US&page=1&year=' + year;

    const queue = new MovieQueue();
    const [results, setResults] = useState([]);
    const [banner, setBanner] = useState('');
    const [poster, setPoster] = useState('');
    const [director, setDirector] = useState('');
    const [logged, setLogged] = useState('Log');

    useEffect(() => {
        if (queue.length === 0) {
            fetch(queryUrl, options)
                .then(res => res.json())
                .then(json => {
                    setResults(json.results);
                    setPoster('https://image.tmdb.org/t/p/original' + json.results[0].poster_path);
                })
                .catch(err => console.log(err))
        }
    }, []);

    useEffect(() => {
        let exists = false;

        for (let i = 0; i < json['pridelightbourne'].films.length; i++) {
            if (json['pridelightbourne'].films[i].id === id) {
                exists = true;
                break;
            }
        }
        if (exists) {
            setLogged('Logged');
        }
    });

    for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.original_title !== null) {
            const map = {
                id: result.id,
                title: result.original_title,
                description: result.overview,
                release: result.release_date,
                poster: 'https://image.tmdb.org/t/p/original' + result.poster_path,
                backdrop: 'https://image.tmdb.org/t/p/w1280' + result.backdrop_path,
                popularity: result.popularity
            };
            queue.enqueue(map);
            break;
        }
    }
    const id = queue.get(0) == null ? 0 : queue.get(0).id;

    if (banner === '') {
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
                return;
            })
          .catch(err => console.error('error:' + err));
    }

    if (director === '') {
        let dir = [];
        let d = '';
        fetch('https://api.themoviedb.org/3/movie/' + id + '/credits?language=en-US', options)
            .then(res => res.json())
            .then(json => {
                const crew = json.crew;

                for (let j = 0; j < crew.length; j++) {
                    const member = crew[j];

                    if (member.job === 'Director') {
                        dir.push(member.name);
                    }
                }
                for (let k = 0; k < dir.length; k++) {
                    if (k !== dir.length - 1) {
                        d += dir[k] + ', ';
                    } else {
                        d += dir[k];
                    }
                }
                setDirector(d);
            })
            .catch(err => console.log(err));
    }

    let releaseYear = '';
    let release = '';
    const date = queue.get(0) == null ? '' : queue.get(0).release.split('-');

    switch (date[1]) {
        case '01':
            releaseYear = 'January';
            break;
        case '02': 
            releaseYear = 'February';
            break;
        case '03': 
            releaseYear = 'March';
            break;
        case '04':
            releaseYear = 'April';
            break;
        case '05':
            releaseYear = 'May';
            break;
        case '06':
            releaseYear = 'June';
            break;
        case '07':
            releaseYear = 'July';
            break;
        case '08':
            releaseYear = 'August';
            break;
        case '09':
            releaseYear = 'September';
            break;
        case '10':
            releaseYear = 'October';
            break;
        case '11':
            releaseYear = 'November';
            break;
        case '12':
            releaseYear = 'December';
            break;
        default: break;
    }
    release = releaseYear + ' ' + date[2] + ', ' + date[0];

    window.onunload = () => {
        window.localStorage.clear();
    }

    return (
        <div className="movie-container">
            <center>
                <div className="movie-banner-image" style={{backgroundImage: "url(" + banner + ")"}}></div>
            </center>
            <center>
                <div className="movie-information">
                    <img className="movie-poster" src={poster}></img>
                        <div className="title">
                            <p>{`${queue.get(0) == null ? '' : queue.get(0).title}`}</p>
                                <div className="movie-header">
                                    <p>Directed by {`${director}`}</p>
                                    <p>{`${release}`} </p>
                                </div>
                        </div>
                    <div className="description">
                        <p>{`${queue.get(0) == null ? '' : queue.get(0).description}`}</p>
                    </div>
                </div>
            </center>
            <div className="add-to-section">
                <button className="add-to-button"><StarIcon /> Favorite</button>
                <button className="add-to-button">+ Watchlist</button>
                <button className="add-to-button" onClick={() => {
                    if (window.localStorage.getItem('users') === null) {
                        window.localStorage.setItem('users', JSON.stringify(json));
                    }
                    const user = 'pridelightbourne';
                    const id = queue.get(0) == null ? 0 : queue.get(0).id;
                    let exists = false;

                    for (let i = 0; i < json[user].films.length; i++) {
                        if (json[user].films[i].id === id) {
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        json[user].films.push({
                            id: id,
                            poster: poster
                        });
                        setLogged('Logged');
                        window.localStorage.setItem('users', JSON.stringify(json));
                    }
                }}>{
                    logged
                }</button>
            </div>
            <div className="copyright">
                <center><span style={{color: "blanchedalmond"}}>© Cinematd. Co-founded by Amer Issa & Pride Yin</span></center>
            </div>
        </div>
        
    )
}

export default Movie;