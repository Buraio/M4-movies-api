import { Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { iMovieObj, iPageObj } from "./@types/types";
import { client } from "./database";

const serverErrorMessage: string = "Internal server error";

const createMovie = async (req: Request, res: Response): Promise<Response> => {
  try {
    const createMovieRequest: iMovieObj = req.body;

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

    return res.status(201).json(queryResult.rows[0]);
  } catch (error) {
    return res.status(500).send(serverErrorMessage);
  }
};

const readMovies = async (req: Request, res: Response): Promise<Response> => {
  try {
    const perPage: number = Number(req.query.perPage) || 5;
    let page: number = Number(req.query.page) || 0;

    const queryString: string = `
    SELECT 
      *
    FROM
      movie_table 
    LIMIT $1 OFFSET $2;
  `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [perPage, perPage * (page - 1)],
    };

    const queryResult: QueryResult = await client.query(queryConfig);

    const prevPage = page - 1 >= 0 ? null : page - 1;
    const nextPage = page + 1;

    const resultObj: iPageObj = {
      prevPage,
      nextPage,
      data: queryResult.rows,
    };

    if (resultObj.data.length === 0) {
      return res.status(404).json({
        message: "Error: page does not exist",
      });
    }

    return res.status(200).json(resultObj);
  } catch (error) {
    return res.status(500).json({
      message: serverErrorMessage,
    });
  }
};

const patchMovie = async (req: Request, res: Response): Promise<Response> => {
  try {
    const paramsId: number = parseInt(req.params.id);
    const requestBody: iMovieObj[] = Object.values(req.body);

    const queryString: string = `
      UPDATE
        movie_table
      SET
        movieName = $1,
        movieDescription = $2,
        movieDuration = $3,
        moviePrice = $4
      WHERE
        movieId = $5
      RETURNING *;
    `;

    const queryConfig: QueryConfig = {
      text: queryString,
      values: [...requestBody, paramsId],
    };

    const queryResult: QueryResult = await client.query(queryConfig);

    return res.status(200).json(queryResult.rows[0]);
  } catch (error) {
    return res.status(500).send(serverErrorMessage);
  }
};

const deleteMovie = async (req: Request, res: Response): Promise<Response> => {
  const paramsId: number = parseInt(req.params.id);

  const queryString: string = `
    DELETE FROM
      movie_table
    WHERE 
      movieId = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [paramsId],
  };

  await client.query(queryConfig);

  return res.status(204).send();
};

export { createMovie, readMovies, patchMovie, deleteMovie };
