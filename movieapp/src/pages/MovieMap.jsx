import "./moviemap.css";
import { FiArrowRight } from "react-icons/fi";

import React, { useState, useEffect } from 'react';

const MovieMap = () => {
  const [zipcode, setZipcode] = useState('');
  const [map, setMap] = useState(null);
  const [placesService, setPlacesService] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places&callback=`;
    script.async = true;
    script.onload = () => initializeMap();
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 40.730610, lng: -73.935242 },
      zoom: 13,
    });

    const placesService = new window.google.maps.places.PlacesService(map);

    setMap(map);
    setPlacesService(placesService);
  };

  const searchMovieTheaters = () => {
    if (!zipcode) {
      alert('Please enter a valid zipcode.');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: zipcode }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results.length > 0) {
        const location = results[0].geometry.location;
        map.setCenter(location);

        placesService.nearbySearch(
          {
            location,
            radius: 5000,
            type: 'movie_theater',
          },
          (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const movieTheaters = results.filter(place =>
                place.types.includes('movie_theater')
              );

              markers.forEach((marker) => marker.setMap(null));

              markers = movieTheaters.map((place) => {
                const marker = new window.google.maps.Marker({
                  position: place.geometry.location,
                  map: map,
                  title: place.name,
                });

                marker.addListener('click', () => {
                  const infowindow = new window.google.maps.InfoWindow({
                    content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`,
                  });

                  infowindow.open(map, marker);
                });

                return marker;
              });
            }
          }
        );
      } else {
        alert('Could not find location for the entered zipcode.');
      }
    });
  };

  let markers = [];

  return (
    <div className="movie-map-container">
      <label>
        Enter Zipcode:
        <div class="search-box">
        <input
          type="text"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value)}
        />                         
        </div>
      </label>
      <button onClick={searchMovieTheaters} className="search-button" role="button">Search Movie Theaters <FiArrowRight /></button>
      <div id="map" style={{ height: 'calc(100vh - 40px)', width: '100%' }}></div>
    </div>
  );
};

export default MovieMap;

