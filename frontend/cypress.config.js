import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Reducir la velocidad de video para no consumir tanto disco en CI
    video: false,
    screenshotOnRunFailure: true,
    supportFile: false
  },
});
