import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:4000/openapi/json",

  output: "src/lib/api",

  plugins: [
    "@hey-api/client-fetch",
  ],
});