import React, { useState, useEffect } from "react";

import App from "../App";
import MovieQueue from '../util/MovieQueue';

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: '' + auth
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

    useEffect(() => {
        if (queue.length === 0) {
            fetch(queryUrl, options)
                .then(res => res.json())
                .then(json => {
                    setResults(json.results);
                })
                .catch(err => console.log(err))
        }
    }, []);

    for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.original_title !== null) {
            const map = {
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

    return (
        <>
            <p>{`${queue.get(0) == null ? '' : queue.get(0).title}`}</p>
            <p>{`${queue.get(0) == null ? '' : queue.get(0).description}`}</p>
        </>
    )
}

export default Movie;