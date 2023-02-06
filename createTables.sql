CREATE TABLE IF NOT EXISTS movie_table (
  movieId BIGSERIAL PRIMARY KEY, 
  movieName VARCHAR(50) NOT NULL, 
  movieDescription TEXT, 
  movieDuration INTEGER NOT NULL, 
  moviePrice INTEGER NOT NULL
);
