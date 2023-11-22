
import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Home from './pages/HomePage';
import UpcomingMovies from './pages/UpcomingMovies';
import Navbar from './Navbar';
import MoviesPage from './pages/MoviesPage';
import Movie from './pages/Movie';
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
        <Route path="/movie/:movieid" element={<Movie/>}/>
      </Routes>

      {/* <Home/> */}
      {/* <UpcomingMovies/> */}
      </div>

  );
}

export default App;