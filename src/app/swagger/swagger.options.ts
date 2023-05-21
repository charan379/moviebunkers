import Config from "@Config";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import swaggerSchemas from "./swagger.schemas";

export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.3",
    info: {
      title: "moviebunkers",
      description: "moviebunkers backend server",
      version: "2.2.0",
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
        url: `${Config.HTTPS ? "https" : "http"}://${Config.DOMAIN_NAME}/api`,
        description: "Production Server",
      },
      {
        url: `http://localhost:${Config.PORT}/api`,
        description: "Local Dev Server",
      },
    ],

    tags: [
      {
        name: "Titles",
      },
      {
        name: "Users",
      },
      {
        name: "Auth",
      },
      {
        name: "UserData",
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
        CookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "auth",
        },
      },
      schemas: swaggerSchemas,
      examples: {},
    },

    security: [
      {
        jwt: [],
        cookieAuth: [],
      },
    ],
  },
  apis: [path.join(process.cwd(), "./src/app/controllers/api/*.ts")],
};

export const swaggerDocs = swaggerJSDoc(swaggerOptions);
