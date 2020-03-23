
import {useState, useEffect} from 'react';
import {API_URL, API_KEY} from '../../config'

export const useFetchMovies = () => {

    const [state,   setState]         = useState({ movies: [] });
    const [isLoading, setIsLoading]   = useState(false);
    const [isError,   setIsError]     = useState(false);


     const fetchMovies = async endpoint => {
         setIsError(false);
         setIsLoading(true);

         const params = new URLSearchParams(endpoint);

         if(!params.get('page')) {
            setState(prev=> ({
              ...prev,
              movies:[],
              searchTerm: params.get('query'),
            })) ; 
         }

         try {
          const result = await ( await fetch(endpoint)).json();
         
          const heroImage = result.results[0]
         
          setState(prev=> ({
            ...prev,
            movies: [...prev.movies, ...result.results],
            heroImage: heroImage,
            currentPage: result.page,
            totalPages: result.total_pages
          }));
         } catch (e) {
           setIsError(true);
         }
         setIsLoading(false);
      }

      // Initlization
      useEffect(() => {
        // Run Only on first time 
        if(sessionStorage.getItem('HomeState')) {
           const persistanceStrage = JSON.parse(sessionStorage.getItem('HomeState'));
           setState({ ...persistanceStrage });
        } else {
             fetchMovies(`${API_URL}movie/popular?api_key=${API_KEY}`);
        }
     
      }, []);
      // Store State
      useEffect(()=> {
         if(!state.searchTerm) {
            sessionStorage.setItem('HomeState', JSON.stringify(state));
         }
      }, [state]);

    return [{ state, isLoading, isError }, fetchMovies];
}