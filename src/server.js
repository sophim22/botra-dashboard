import app, { port } from "./app";

const server = app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

server.on("close", () => {
  console.log("Closed express server");

  db.pool.end(() => {
    console.log("Shut down connection pool");
  });
});
