async function getMovies(){
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ODBiZWZmZTViOWZiNGVkMjgyZmQzOTNiOWRiMjFjNSIsInN1YiI6IjY1Njc4ZTU0YThiMmNhMDEwYmMxZDhkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7bfLJqKdPmAq2T8fLT5HBw49iTqeu2JzA1Qpq2KxDbg'
    }
  };
  
  try{
    return fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
    .then(response => response.json())
  }catch(error){
    console.log(error);
  }
} 

async function getMoreInfo(id){
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ODBiZWZmZTViOWZiNGVkMjgyZmQzOTNiOWRiMjFjNSIsInN1YiI6IjY1Njc4ZTU0YThiMmNhMDEwYmMxZDhkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7bfLJqKdPmAq2T8fLT5HBw49iTqeu2JzA1Qpq2KxDbg'
    }
  };

  try{
    const data = await fetch('https://api.themoviedb.org/3/movie/' + id, options)
    .then(response => response.json());
    return data;

  }catch(error){
    console.log(error);
  }
}

async function watch(e){
  const movie_id = e.currentTarget.dataset.id;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ODBiZWZmZTViOWZiNGVkMjgyZmQzOTNiOWRiMjFjNSIsInN1YiI6IjY1Njc4ZTU0YThiMmNhMDEwYmMxZDhkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7bfLJqKdPmAq2T8fLT5HBw49iTqeu2JzA1Qpq2KxDbg'
    }
  };

  try{
    const data = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/videos`, options)
    .then(response => response.json());

    const {results} = data
    const youtubeVideo = results.find(video => video.type === "Trailer");

    window.open(`https://youtube.com/watch?v=${youtubeVideo.key}`, 'blank')

  }catch(error){
    console.log(error);
  }
  
  
    
}

function createMovieLayout({
  title, 
  stars,
  image,
  time,
  year,
  id
}){
  return   `
    <div class="movie">
      <div class="movie_rate">
        <p>${title}</p>
        <div class="rate">
          <img src="assets/star.svg" alt="">
          <span>${stars}</span>
        </div>
      </div>
      <div class="movie_img">
        <img src="https://image.tmdb.org/t/p/w500${image}" alt="Imagem de ${title}">
      </div>
      <div class="dateAndTime">
        <div class="time">
          <img src="assets/clock_icon.png" alt="imagem de um relógio">
          <span>${time}</span>
        </div>
        <div class="date">
          <img src="assets/calendar-blank.png" alt="imagem de um calendário">
          <span>${year}</span>
        </div>
      </div>
      <button onclick='watch(event)' data-id="${id}" class="play">
        <img src="assets/play-icon.png" alt="icone de play">
        <p>Assistir ao trailer</p>
      </button>
    </div>
  `
};

function select3Videos(results){
  const random = () => Math.floor(Math.random() * results.length);

  let selectedVideos = new Set();

  while(selectedVideos.size < 3){
    selectedVideos.add(results[random()].id);
  };

  return [...selectedVideos];
}

function minutesToHourMinutesAndSeconds(minutes){
  const date = new Date(null);
  date.setMinutes(minutes);
  return date.toISOString().slice(11, 19)
}

async function start(){
  const {results} = await getMovies();
  const best3 = select3Videos(results)
    .map(async movie =>{
    const info = await getMoreInfo(movie);
    const props = {
      id: info.id,
      title: info.title,
      stars: Number(info.vote_average).toFixed(1),
      image: info.poster_path,
      time: minutesToHourMinutesAndSeconds(info.runtime),
      year: info.release_date.slice(0, 4)
    }

    return createMovieLayout(props)
  });

  const output = await Promise.all(best3);

  document.querySelector('.movies').innerHTML = output.join('')
}

start()

