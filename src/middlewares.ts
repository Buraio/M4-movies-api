import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";

const ensureMovieExistsUsingId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const paramsId: number = Number(req.params.id);

  const queryString: string = `
    SELECT *
    FROM movie_table
    WHERE movieId = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [paramsId],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rows.length === 0) {
    return res.status(409).json({
      message: "Movie does not exists",
    });
  }

  next();
};

export { ensureMovieExistsUsingId };
