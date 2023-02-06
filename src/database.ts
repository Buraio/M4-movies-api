import pg from "pg";

export const client = new pg.Client({
  user: "Buraio",
  host: "localhost",
  database: "movie_database",
  password: "@Buraio15",
  port: 5432,
});

export const startDatabase = async () => {
  await client.connect();
  console.log("Database connected!");
}