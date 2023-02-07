interface iMovieObj {
  movieName: string;
  movieDescription: string | null;
  movieDuration: number;
  moviePrice: number;
}

interface iPageObj {
  prevPage: number | null;
  nextPage: number;
  data: iMovieObj[];
}

export { iMovieObj, iPageObj };
