
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Home from './pages/HomePage';
import UpcomingMovies from './pages/UpcomingMovies';
import Navbar from './Navbar';
import MoviesPage from './pages/MoviesPage';
import Movie from './pages/Movie';
import Profile from './pages/Profile';
import FilmsWatched from './pages/FilmsWatched';
// import MovieCache from './util/MovieCache';

function App() {

  /*
  MovieCache.populate();

  window.onunload = () => {
    window.localStorage.clear();
  }
  */


  return (
    
    <div className="App">

      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/films" element={<MoviesPage />} />
        <Route path="/profile/:name" element={<Profile />} />
        <Route path="/profile/:name/logged" element={<FilmsWatched />} />
        <Route path="/films/upcoming" element={<MoviesPage />} />
        <Route path="/films/:genre" element={<MoviesPage />} />
        <Route path="/films/:genre/:popularity" element={<MoviesPage />} />
        <Route path="/films/:genre/:popularity/:decade" element={<MoviesPage />} />
        <Route path="/movie/:movieid" element={<Movie/>}/>
      </Routes>

      {/* <Home/> */}
      {/* <UpcomingMovies/> */}
      </div>

  );
}

export default App;