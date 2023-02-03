import express, { application, Application } from "express";

const app: Application = express();
const port = 3000;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
