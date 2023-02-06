import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { iMovieObj } from "./@types/types";
import { client } from "./database";

const serverErrorMessage: string = "Internal server error";

const createMovie = async (req: Request, res: Response): Promise<Response> => {
  const createMovieRequest: iMovieObj = req.body;
  console.log(createMovieRequest);

  let queryString: string = `
    SELECT * 
    FROM movie_table 
    WHERE moviename = $1;
  `;

  let queryConfig: QueryConfig = {
    text: queryString,
    values: [req.body.movieName],
  };

  let queryResult: QueryResult = await client.query(queryConfig);

  const queryResultObj: iMovieObj = queryResult.rows[0];

  if (queryResultObj !== undefined) {
    return res.status(409).json({
      message: "Movie already exists",
    });
  }

  queryString = `
    INSERT INTO movie_table(
      moviename, 
      moviedescription, 
      movieduration, 
      movieprice
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  queryConfig = {
    text: queryString,
    values: Object.values(createMovieRequest),
  };

  queryResult = await client.query(queryConfig);

  return res.status(201).json(queryResult.rows);
};

const readMovies = async (req: Request, res: Response) => {
  try {
    const perPage: number =
      req.query.perPage === undefined ? 5 : Number(req.query.perPage);
    let page: number =
      req.query.page === undefined ? 0 : Number(req.query.page);

    page = page * perPage;

    const queryString: string = `
    SELECT 
      *
    FROM
      movie_table 
    LIMIT $1 OFFSET $2;
  `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [perPage, page],
    };

    const queryResult = await client.query(queryConfig);

    return res.status(200).json(queryResult.rows);
  } catch (error) {
    return res.status(500).send(serverErrorMessage);
  }
};

const patchMovie = async (req: Request, res: Response) => {};

export { createMovie, readMovies };
