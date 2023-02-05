import express, { application, Application } from "express";
import { startDatabase } from "./database";

const app: Application = express();
const port = 3000;

app.listen(port, async () => {
  await startDatabase();
  console.log(`App is running on port ${port}`);
});
