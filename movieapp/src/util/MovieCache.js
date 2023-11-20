// TODO: CACHE WORK IN PROGRESS

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: '' + auth
    }
};

export default class MovieCache {
    constructor() {
        this.cache = [];

        for (let i = 1; i < 110; i++) {
            fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=' + i, options)
                .then(res => res.json())
                .then(json => {
                    if (json === undefined || json.results.length === 0) return;

                    const results = json.results;

                    for (let i = 0; i < results.length; i++) {
                        const result = results[i];
                        const releaseDate = result.release_date.split('-');

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
                    console.log(err);
                });
        }
    }
    getCache() {
        return this.cache;
    }
}