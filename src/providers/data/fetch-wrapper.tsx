import { error } from "console";
import { GraphQLFormattedError } from "graphql";

type Error = {
  message: string;
  statusCode: string;
};

const customFetch = async (url: string, options: RequestInit) => {
  const accessToken = localStorage.getItem("access_token");

  /*Here Record<string, string> type is a TypeScript utility type representing an
  object with string keys and string values .However, using type assertions should 
  be done with caution.f the actual type of options.headers doesn't match the asserted type,
  you may encounter runtime errors. It's generally better to use type checks 
  (e.g., typeof, instanceof, etc.) or more precise type annotations when possible. 
  If you're confident that the structure of options.headers is correct, a type assertion can be a reasonable approach.*/

  /*Record<string, string> is a TypeScript utility type that represents an object type where all keys are of type string 
  and all values are of type string. The Record utility type is a generic type that takes two type parameters: the key type 
  and the value type. */
  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      Authorization: headers.Authorization || `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Apollo-Require-Preflight": "true", //GraphQL client that used in front end to make request to graphQL api by avoiding CORS ERROS
    },
  });
};

// error handling

const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>
): Error | null => {
  if (!body) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    };
  }
  if ("errors" in body) {
    const errors = body?.errors;
    const messages = errors?.map((error) => error?.message)?.join("");
    const code = errors?.[0]?.extensions?.code;

    return {
      message: messages || JSON.stringify(errors),
      statusCode: code || 500,
    };
  }

  return null;
};

export const fetchWrapper = async (url: string, options: RequestInit) => {
  const response = await customFetch(url, options);
  const responseClone = response.clone(); // once response has used, we can not use it again, because it is consumed,
  // If we want to use it in multiple ways, we have to clone it

  const body = await responseClone.json();
  const error = getGraphQLErrors(body);

  if (error) {
    throw error;
  }

  return response;
};
