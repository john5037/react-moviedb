import React, { useState, useEffect  } from 'react';

import { API_URL, API_KEY, IMAGE_BASE_URL, POSTER_SIZE, BACKDROP_SIZE} from '../../config';
import HeroImage from '../elements/HeroImage/HeroImage';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import './Home.css';


const  Home = () => {

    const [Movies, setMovies] = useState([]);
  
    const [MainImage, setMainImage] = useState(null);
    const [Loading, setLoading] = useState(false);
    const [CurrentPage, setCurrentPage]= useState(0);
    const [TotalPages, setTotalPages]= useState(0);
    const [SearchTerm, setSearchTerm] = useState('');

    // Initlization
    useEffect(() => {
      // Run Only on first time
      const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
      fetchItems(endpoint);

    },[]);

    const loadMoreItems = () => {
      let endpoint = '';
      setLoading(false)

      if (SearchTerm === '') {
        endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
      } else {
        endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${SearchTerm}&page=${CurrentPage + 1}`;
      }
      fetchItems(endpoint);
    }

    const searchItems = (searchTerm) => {
      let endpoint = '';

      if (searchTerm === '') {
        endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
      } else {
        endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
      }

      setMovies([]);
      console.log(Movies);

      fetchItems(endpoint);
    }

    async function fetchApi(endpoint) {
      let result = await fetch(endpoint);
        //.then(result => result.json())
      let data = result.json();
      return data;
    }  
    const fetchItems =  (endpoint) => {
        
      fetchApi(endpoint)
        .then(result => {

          // Now Set The State
          setMovies([...Movies, ...result.results]);

          setMainImage(MainImage || result.results[0]);

          setLoading(false);
          setCurrentPage(result.page);
          setTotalPages(result.total_pages);
          
          if (SearchTerm === "") {
             // localStorage.setItem('HomeState', JSON.stringify(this.state));
          }

        })
          .catch(error => console.error('Error:', error))
    }
    return (
      <div className="rmdb-home">
      
        <div>
        { MainImage && 
          <HeroImage
            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${MainImage.backdrop_path}`}
            title={MainImage.original_title}
            text={MainImage.overview}
          />
        }
        </div> 
        
        <div className="rmdb-home-grid">
          <FourColGrid
            header={SearchTerm ? 'Search Result' : 'Popular Movies'}
            loading={Loading}
            >
            {Movies.map ( (element, i) => {
              return <MovieThumb
                        key={i}
                        clickable={true}
                        image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                        movieId={element.id}
                        movieName={element.original_title}
                     />
            })}
          </FourColGrid>
        </div>
      </div>
    );
}

export default Home;