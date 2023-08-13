import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  env: {
    BASE_URL:
      process.env.NODE_ENV === "test"
        ? process.env.NEXTAUTH_URL ?? "http://localhost:3000"
        : process.env.BASE_URL ?? "http://localhost:3000",
  },

  e2e: {
    setupNodeEvents(on, config) {},
  },
});
