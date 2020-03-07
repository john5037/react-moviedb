import React, { useState,useEffect } from 'react';
import { API_URL, API_KEY } from '../../config';
import Navigation from '../elements/Navigation/Navigation';
import MovieInfo from '../elements/MovieInfo/MovieInfo';
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid.js';
import Actor from '../elements/Actor/Actor';
import Spinner from '../elements/Spinner/Spinner';
import './Movie.css';

function  Movie(props){
 
  const movieId = props.match.params.movieId
  // Set State Value
  const [Movie, setMovie] =useState(null);
  const [Actors, setActors] =useState(null);
  const [Directors, setDirectors] =useState([]);
  const [Loading, setLoading] =useState(null);


  // on Loading
  useEffect(()=> {

    // ES6 destructuring the props
    setLoading(true)

    // First fetch the movie ...
    let endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
    fetchItems(endpoint);

  })
 


  const fetchItems = async endpoint => {

    try {
      const result = await (await fetch (endpoint)).json();
      if (result.status_code) {
        // If we don't find any movie
        setLoading(false)
      } else {
        // if we find movie
        setMovie(result);
        
        const creditEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
        const creditResult = await (await fetch(creditEndpoint)).json()
        const directors = creditResult.crew.filter( (member) => member.job === "Director");

        // Set Values
        setActors(creditResult.cast)
        setDirectors(directors);
        setLoading(false)
      }
    }
    catch(e) {
      console.log('There was as error',e)
    }
  }
  

  
    return (
          // ES6 Destructuring the props and state
   
      <div className="rmdb-movie">
        {Movie ?
        <div>
          <Navigation movie={Movie.title} />
          <MovieInfo movie={Movie} directors={Directors} />
          <MovieInfoBar time={Movie.runtime} budget={Movie.budget} revenue={Movie.revenue} />
        </div>
        : null }
        {Actors ?
        <div className="rmdb-movie-grid">
          <FourColGrid header={'Actors'}>
            {Actors.map( (element, i) => (
              <Actor key={i} actor={element} />
            ))}
          </FourColGrid>
        </div>
        : null }
        {!Actors && !Loading ? <h1>No movie found</h1> : null }
        {Loading ? <Spinner /> : null}
      </div>
    )
  
}

export default Movie;