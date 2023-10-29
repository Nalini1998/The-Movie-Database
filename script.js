import React, { useState } from "https://cdn.skypack.dev/react@17";
import { render } from "https://cdn.skypack.dev/react-dom@17";
import {
  useQuery,
  QueryClient,
  QueryClientProvider
} from "https://cdn.skypack.dev/react-query@3";

const queryClient = new QueryClient();

const Movie = (props) => {
  const { poster_path, title, vote_average } = props;

  return (
    <div className="movie">
      <figure className="movie__figure">
        <img
          src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${poster_path}`}
          className="movie__poster"
        />
        <figcaption>
          <span className="movie__vote">{vote_average}</span>
        </figcaption>
        <h2 className="movie__title">{title}</h2>
      </figure>
    </div>
  );
};

const Movies = (props) => {
  const { movies } = props;

  return (
    <ul className="movies">
      {movies.map((movie) => (
        <li key={movie.id}>
          <Movie {...movie} />
        </li>
      ))}
    </ul>
  );
};

const Search = (props) => {
  const { onInput, query, ...otherProps } = props;

  return (
    <form className="search" onInput={onInput}>
      <input type="search" value={query} {...otherProps} />
    </form>
  );
};

const API_BASE = "https://api.themoviedb.org/3";
const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1M2ZmNjljNmRiM2YxMjgxZTk2ZTRlODQ5ZWRhNmQ2NSIsInN1YiI6IjU2YzRhZmU1YzNhMzY4MGQzZTAwMDIyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.-TqKfzJ2O4yVBYI0aiaUDgkg_WDRhOoRfnC5U-QE2SU";

async function fetcher(url) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

function App() {
  const [query, setQuery] = useState("");

  const url = query ? `/search/movie?query=${query}` : "/movie/popular";
  const { isLoading, isError, data, error } = useQuery([url], () =>
    fetcher(url)
  );

  if (isError) {
    return <div>Error: {error}</div>;
  }

  function onInput(event) {
    const { value } = event.target;

    setQuery(value);
  }

  return (
    <div className="app">
      <Search
        query={query}
        onInput={onInput}
        placeholder="🔎"
      />
      {isLoading ? <div>Loading …</div> : <Movies movies={data.results} />}
    </div>
  );
}

function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

render(<Root />, document.getElementById("root"));

const getGenres = async () => {
  const genreRequestEndpoint = '/genre/movie/list';
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;

  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const genres = jsonResponse.genres;
      return genres;
    }
  } catch (error) {
    console.log(error);
  };
};

// Get a Random Movie

  const getMovies = async () => {
    const selectedGenre = getSelectedGenre();
    // save the endpoint to a variable called discoverMovieEndpoint
    const discoverMovieEndpoint = '/discover/movie';
    // create a variable called requestParams
    const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
    const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;
    try {
      const response = await fetch(urlToFetch);
      if (response.ok) {
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        return movies;
      }
    } catch (error) {
      console.log(error);
    };
  };

// Get Movie Info

  const getMovieInfo = async (movie) => {
    const movieId = movie.id;
    const movieEndpoint = `/movie/${movieId}`;
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;

    try {
      const response = await fetch(urlToFetch);
      if (response.ok) {
        const jsonResponse = await response.json();
        const movieInfo = jsonResponse;
        return movieInfo;
      }
    } catch (error) {
      console.log(error);
    };
  };

// Display Movie

// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  const movieInfo = document.getElementById('movieInfo');
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };
  const movies = await getMovies();
  const randomMovie = getRandomMovie(movies);
    const info = await getMovieInfo(randomMovie);
  displayMovie(info);
};

getGenres().then(populateGenreDropdown);
playBtn.onclick = showRandomMovie;


// Populate dropdown menu with all the available genres
const populateGenreDropdown = (genres) => {
  const select = document.getElementById('genres')

  for (const genre of genres) {
      let option = document.createElement("option");
      option.value = genre.id;
      option.text = genre.name;
      select.appendChild(option);
  }
};

// Returns the current genre selection from the dropdown menu
const getSelectedGenre = () => {
  const selectedGenre = document.getElementById('genres').value;
  return selectedGenre;
};

// Displays the like and dislike buttons on the page
const showBtns = () => {
  const btnDiv = document.getElementById('likeOrDislikeBtns');
  btnDiv.removeAttribute('hidden');
};

// Clear the current movie from the screen
const clearCurrentMovie = () => {
  const moviePosterDiv = document.getElementById('moviePoster');
  const movieTextDiv = document.getElementById('movieText');
  moviePosterDiv.innerHTML = '';
  movieTextDiv.innerHTML = '';
}

// After liking a movie, clears the current movie from the screen and gets another random movie
const likeMovie = () => {
  clearCurrentMovie();
  showRandomMovie();
};

// After disliking a movie, clears the current movie from the screen and gets another random movie
const dislikeMovie = () => {
  clearCurrentMovie();
  showRandomMovie();
};

// Create HTML for movie poster
const createMoviePoster = (posterPath) => {
  const moviePosterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;

  const posterImg = document.createElement('img');
  posterImg.setAttribute('src', moviePosterUrl);
  posterImg.setAttribute('id', 'moviePoster');

  return posterImg;
};

// Create HTML for movie title
const createMovieTitle = (title) => {
  const titleHeader = document.createElement('h1');
  titleHeader.setAttribute('id', 'movieTitle');
  titleHeader.innerHTML = title;

  return titleHeader;
};

// Create HTML for movie overview
const createMovieOverview = (overview) => {
  const overviewParagraph = document.createElement('p');
  overviewParagraph.setAttribute('id', 'movieOverview');
  overviewParagraph.innerHTML = overview;

  return overviewParagraph;
};

// Returns a random movie from the first page of movies
const getRandomMovie = (movies) => {
  const randomIndex = Math.floor(Math.random() * movies.length);
  const randomMovie = movies[randomIndex];
  return randomMovie;
};

// Uses the DOM to create HTML to display the movie
const displayMovie = (movieInfo) => {
  const moviePosterDiv = document.getElementById('moviePoster');
  const movieTextDiv = document.getElementById('movieText');
  const likeBtn = document.getElementById('likeBtn');
  const dislikeBtn = document.getElementById('dislikeBtn');

  // Create HTML content containing movie info
  const moviePoster = createMoviePoster(movieInfo.poster_path);
  const titleHeader = createMovieTitle(movieInfo.title);
  const overviewText = createMovieOverview(movieInfo.overview);

  // Append title, poster, and overview to page
  moviePosterDiv.appendChild(moviePoster);
  movieTextDiv.appendChild(titleHeader);
  movieTextDiv.appendChild(overviewText);

  showBtns();
  likeBtn.onclick = likeMovie;
  dislikeBtn.onclick = dislikeMovie;
};