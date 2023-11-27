import './profile.css';
import Avatar from '../Assets/avatar.jpg';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { BiSolidRightArrow } from 'react-icons/bi';

let todaysDate = new Date().toLocaleDateString().split('/');
todaysDate = [parseInt(todaysDate[0]), parseInt(todaysDate[1]), parseInt(todaysDate[2])];

var storage = require('../storage/members.json');
let json = JSON.parse(JSON.stringify(storage));

// 'https://api.themoviedb.org/3/movie/movie_id?language=en-US'

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: ''
    }
};

function Profile() {
    let user = window.location.href.split('/')[4];
    const name = json[user].name;
    const bio = json[user].bio;

    const [movies, setMovies] = useState([]);
    const [banner, setBanner] = useState([]);

    const promises = [];

    useEffect(() => {
        for (let i = 0; i < json[user].films.length; i++) {
            if (i >= 5) {
                break;
            }
            promises.push(fetch('https://api.themoviedb.org/3/movie/' + json[user].films[i].id + '?language=en-US', options).then(res => res.json()).then(json => json));
        }
        const res = [];
        const movs = [];
        Promise.all(promises).then(results => {
            for (let i = 0; i < results.length; i++) {
                let release = '';
                let poster = 'https://image.tmdb.org/t/p/original' + results[i].poster_path;

                if (results[i].release_date !== undefined) {
                    release = results[i].release_date.split('-')[0];
                }
                for (let j = 0; j < json[user].films.length; j++) {
                    if (json[user].films[j].id === results[i].id && json[user].films[j].poster !== undefined) {
                        poster = json[user].films[j].poster;
                    }
                }
                const map = {
                    title: results[i].original_title,
                    page_title: results[i].original_title.replaceAll(' ', '-').toLowerCase() + '-' + release,
                    poster: poster,
                    backdrop: 'https://image.tmdb.org/t/p/w1280' + results[i].backdrop_path
                }
                res.push(map);
            }
            const breakRandom = Math.floor(Math.random() * res.length);
            for (let i = 0; i < res.length; i++) {
                const movie = res[i];
    
                if (movie === undefined) {
                    continue;
                }
                if (breakRandom === i) {
                    setBanner('https://image.tmdb.org/t/p/w1280' + movie.backdrop);
                }
                movs.push(<Link to={`/movie/${movie.page_title}`}><img className='poster-sizing' src={movie.poster}></img></Link>);
            }
            setMovies(movs);
        });
    }, []);

    return(

        <div className='profile-page-container'>
            <div className='profile-banner'>
                <div className="movie-banner-image" style={{backgroundImage: "url(" + banner + ")"}}></div>
            </div>
            <div className="profile-box">
                <h1>{user}</h1>
                    <img className='profile-picture' src={Avatar}></img>
                        <div className='profile-name'>
                            <h1>{name}</h1>
                        </div>
                        <div className='filmswatched-link'>
                                    <h1><Link className='watch-link' to = {`/profile/${user}/logged`}>Films Watched<BiSolidRightArrow /></Link></h1>
                                </div>
                    <div className='profile-description'>
                        <p>{bio}</p>
                    </div>
                    <div className='profile-favorite-movies-title'><h3>Favorite Movies</h3></div>
                    <div className='profile-favorite-movies'>
                            <ol>{movies}</ol>
                    </div>
                    <div className='watchlist-title'><h3>Watchlist</h3></div>
                    <div className='watchlist-movies'>
                            <ol>{}</ol>
                    </div>
                    <div className="expand-button">
                        <button onClick={() => {
                        }} class="expand" role="button"><h4>+</h4></button>
                    </div>
            </div>
        </div>
    )
}
export default Profile;