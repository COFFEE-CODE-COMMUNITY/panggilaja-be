import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PanggilAja! API Documentation",
      version: "1.0.0",
      description: "Dokumentasi REST API untuk platform PanggilAja!",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"], // lokasi file tempat komentar JSDoc berada
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
