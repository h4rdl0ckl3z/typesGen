import { Elysia } from "elysia";
import { t } from "elysia";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
} from "../models/users.model";

let users = [
  {
    id: 1,
    name: "John",
    email: "john@example.com",
  },
];

export const usersRoute = new Elysia({ prefix: "/users", detail: { tags: ["Users"] } })

  // GET /users
  .get(
    "/",
    () => users,
    {
      response: t.Array(User)
    }
  )

  // GET /users/:id
  .get(
    "/:id",
    ({ params }) => {
      const user = users.find((u) => u.id === Number(params.id));

      if (!user) return new Response("Not Found", { status: 404 });

      return user;
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      response: User,
    }
  )

  // POST /users
  .post(
    "/",
    ({ body }) => {
      const user = {
        id: Date.now(),
        ...body,
      };

      users.push(user);

      return user;
    },
    {
      body: CreateUserDto,
      response: User,
    }
  )

  // PATCH /users/:id
  .patch(
    "/:id",
    ({ params, body }) => {
      const user = users.find(
        (u) => u.id === Number(params.id)
      );

      if (!user) return new Response("Not Found", { status: 404 });

      Object.assign(user, body);

      return user;
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
      body: UpdateUserDto,
      response: User,
    }
  )

  // DELETE /users/:id
  .delete(
    "/:id",
    ({ params }) => {
      users = users.filter(
        (u) => u.id !== Number(params.id)
      );

      return {
        success: true,
      };
    },
    {
      params: t.Object({
        id: t.Number(),
      }),
    }
  );