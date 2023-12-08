import './filmswatched.css';
import Avatar from '../Assets/avatar.jpg';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { BiSolidRightArrow } from 'react-icons/bi';

import firebase from 'firebase/compat/app';
import { getFirestore, collection, getDocs, setDoc, doc } from "firebase/firestore";

let todaysDate = new Date().toLocaleDateString().split('/');
todaysDate = [parseInt(todaysDate[0]), parseInt(todaysDate[1]), parseInt(todaysDate[2])];

// 'https://api.themoviedb.org/3/movie/movie_id?language=en-US'

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: ''
    }
};

function FilmsWatched () {
    let user = window.location.href.split('/')[4];

    const [movies, setMovies] = useState([]);
    const [json, setJSON] = useState({});

    const promises = [];

    useEffect(() => {
        const getJSON = async () => {
            const ref = collection(getFirestore(app), 'members');
        
            // await setDoc(doc(getFirestore(app), "members", "member"), json);
        
            const querySnapshot = await getDocs(collection(getFirestore(app), "members"));
            querySnapshot.forEach((doc) => {
                if (doc.data().test === undefined) {
                    setJSON(doc.data());
                }
            });
        }
        getJSON();
    }, {});

    if (json[user] !== undefined) {
        for (let i = 0; i < json[user].films.length; i++) {
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
                    poster: poster
                }
                res.push(map);
            }
            for (let i = 0; i < res.length; i++) {
                const movie = res[i];
    
                if (movie === undefined) {
                    continue;
                }
                movs.push(<Link to={`/movie/${movie.page_title}`}><img className='poster-sizing' src={movie.poster}></img></Link>);
            }
            setMovies(movs);
        });
    }
    
    return (
        <div className="films-page-container">
            <div className="films-box">
                <div className='title'>
                     <h1>{`${user}'s Logged Films`}</h1>
                </div>
                <div className='films-posters'>
                    <ol>{movies}</ol>
                </div>

            </div>
        </div>

    )
}
export default FilmsWatched;
