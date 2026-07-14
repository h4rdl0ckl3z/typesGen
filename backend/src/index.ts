import { Elysia } from "elysia";
import { usersRoute } from "./routes/users.route";
import openapi from "@elysia/openapi";
import cors from "@elysia/cors";

const app = new Elysia()
  .use(cors())
  .use(openapi())
  .use(usersRoute)
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
