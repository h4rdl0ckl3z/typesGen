import { t } from "elysia";

export const User = t.Object({
  id: t.Number(),
  name: t.String(),
  email: t.String(),
});

export const CreateUserDto = t.Object({
  name: t.String(),
  email: t.String(),
});

export const UpdateUserDto = t.Partial(CreateUserDto);