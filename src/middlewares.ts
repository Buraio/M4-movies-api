import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "./database";

const ensureMovieExistsUsingId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paramsId: number = Number(req.params.id);

  const queryString = `
    SELECT *
    FROM movie_table
    WHERE movieId = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [paramsId],
  };

  const queryResult = client.query(queryConfig);

  console.log(queryResult);

  if (queryResult === undefined) {
    return res.status(409).json({
      message: "Movie does not exists",
    });
  }

  next();
};

export { ensureMovieExistsUsingId };
