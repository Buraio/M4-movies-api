interface iMovieObj {
  movieName: string;
  movieDescription: string | null;
  movieDuration: number;
  moviePrice: number;
}

interface iMovieQueryObj extends iMovieObj {
  movieid: string;
}

interface iPageObj {
  prevPage: number | null;
  nextPage: number;
  data: iMovieObj[];
}

type QueryObjKeys = ["movieid"]

export { iMovieObj, iMovieQueryObj, iPageObj };
