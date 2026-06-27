import { createSwaggerSpec } from "next-swagger-doc";
import { paths, components, tags } from "./registry";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
      info: {
        title: "AI Agent Builder API Documentation",
        version: "1.0",
        description: "Official REST API specifications for the AI Agent Builder platform. Authenticate endpoints using HTTP-only cookies (accessToken and refreshToken).",
      },
      paths,
      tags,
      components,
      security: [
        {
          AccessTokenAuth: [],
          RefreshTokenAuth: [],
        },
      ],
    },
  });
  return spec;
};