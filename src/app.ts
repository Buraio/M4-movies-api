import express, { Application } from "express";
import { startDatabase } from "./database";
import { createMovie, deleteMovie, patchMovie, readMovies } from "./functions";
import { ensureMovieExistsUsingId } from "./middlewares";

const app: Application = express();
const port = 3000;
app.use(express.json());

app.post("/movies", createMovie);
app.get("/movies", readMovies);
app.patch("/movies/:id", ensureMovieExistsUsingId, patchMovie);
app.delete("/movies/:id", ensureMovieExistsUsingId, deleteMovie);

app.listen(port, async () => {
  await startDatabase();
  console.log(`App is running on port ${port}`);
});
