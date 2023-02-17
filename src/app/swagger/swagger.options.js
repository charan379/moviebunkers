const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const swaggerSchemas = require("./swagger.schemas");
const {newMovieExample,newTvExample} = require("./swagger.examples");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "moviebunkers",
      description: "moviebunkers app server",
      version: "1.0.0",
      contact: {
        name: "charan379",
        url: "#",
      },
      license: {
        name: "GNU Affero General Public License",
        url: "https://www.gnu.org/licenses/agpl-3.0.en.html",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local Server",
      },
      {
        url: "http://localhost:3010",
        description: "Local Server",
      },
    ],

    tags: [
      {
        name: "Titles",
      },
      {
        name: "Users",
      },
    ],

    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT",
        },
      },
      schemas: swaggerSchemas,
      examples: {
        newMovieExample,newTvExample
      },
    },

    security: [
      {
        jwt: [],
      },
    ],
  },
  apis: [path.join(process.cwd(), "./src/app/routes/*.js")],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerOptions, swaggerDocs };
