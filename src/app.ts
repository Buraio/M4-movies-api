import express, { application, Application } from "express";
import { startDatabase } from "./database";
import { createMovie, readMovies } from "./functions";

const app: Application = express();
const port = 3000;
app.use(express.json());

app.post("/movies/create", createMovie);
app.get("/movies/list", readMovies);

app.listen(port, async () => {
  await startDatabase();
  console.log(`App is running on port ${port}`);
});
