
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Home from './pages/HomePage';
import UpcomingMovies from './pages/UpcomingMovies';
// import Navbar from './pages/Navbar';
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
      <Home/>
      <UpcomingMovies/>
    </div>
  );
}

export default App;