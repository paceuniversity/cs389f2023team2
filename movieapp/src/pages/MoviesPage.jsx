import React, { useEffect, useState } from 'react';
// import MovieCache from '../util/MovieCache';

// Hoping that this does not get initialized for every user who opens this page.
// Cache should be in memory for the entire application globally.

// If not, then I need to find a way to make movie data accessible in memory for all
// users.

// ^ Edit: Scratch that. No longer want to do this. I'll come back to this another time.
// Probably when it should exist in cache only when on the Movies page. Otherwise, we
// have no use for it.

function MoviesPage() {
    // Deprecated. Not going to use. Probably.
    /*
    let [cache, setCache] = useState([]);

    useEffect(() => {
        setCache(localStorage.getItem('cache') == null ? [] : JSON.parse(localStorage.getItem('cache')));
    }, []);

    let titles = '';

    cache.forEach(movie => titles += movie.title + '\n');

    console.log('TITLES: ' + titles);
    */
    let titles = 'Movies Page';

    // Honestly not going to mess with localStorage nonsense. 
    // I think it's way too unnecessarily complicated. 
    // Figuring out when to flush the memory is annoying. I don't
    // want to deal with that.

    /*
    MovieCache.populate();

    const keys = Object.keys(localStorage);

    keys.map(key => {
        var val = localStorage.getItem(key);
        var title = JSON.parse(val).title;

        titles += title + '\n';
    });
    window.onunload = () => {
        window.localStorage.clear();
    }
    */

    return (
        <>
            <p>{`${titles}`}</p>
        </>
    );
}

export default MoviesPage;