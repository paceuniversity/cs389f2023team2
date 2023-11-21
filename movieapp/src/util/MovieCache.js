// TODO: CACHE WORK IN PROGRESS

/*
let todaysDate = new Date().toLocaleDateString().split('/');
todaysDate = [parseInt(todaysDate[0]), parseInt(todaysDate[1]), parseInt(todaysDate[2])];

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: '' + auth
    }
};

let notNulled = true;
let page = 1;

export default class MovieCache {
    constructor() {
        this.cache = [];

        while (notNulled) {
            fetch('https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=' + page + '&primary_release_date.gte=' + todaysDate[2] + '-' + todaysDate[0] + '-' + todaysDate[1] + '&sort_by=popularity.desc', options)
                .then(res => res.json())
                .then(json => {
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
                          backdrop: 'https://image.tmdb.org/t/p/w1280' + result.backdrop_path,
                          popularity: result.popularity
                        };
                        this.cache.push(map);
                    }
                })
                .catch(err => {
                    notNulled = false;
                    console.log(err);
                });
            page++;
        }
    }
    getCache() {
        return this.cache;
    }
}
*/