import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";

export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = `${API_BASE_URL}/graphql`;
export const WS_URL = "wss://api.crm.refine.dev/graphql";

export const client = new GraphQLClient(API_URL, {
  // options ->  An object containing request options, such as headers and method

  /* The fetch property is part of an options object passed to the constructor of a 
  GraphQLClient instance. The fetch property is not an inbuilt JavaScript or TypeScript 
  object; instead, it is a property of the options object specific to the GraphQLClient class.
  fetch is a property that expects a function, and it represents the function that will be used to 
  make HTTP requests.*/
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

// ws-> web socket

// WebSocket is a communication protocol that provides a full-duplex communication channel over a single,
// long-lived connection

export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
          const accessToken = localStorage.getItem("access_token");
          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      })
    : undefined;
    
// to make request to the graphql API
export const dataProvider = graphqlDataProvider(client);

// create live Provider
export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient)
  : undefined;
