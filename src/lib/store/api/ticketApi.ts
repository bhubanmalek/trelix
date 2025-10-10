import type {
  CreateTicketRequest,
  CreateTicketResponse,
  GetTicketsResponse,
  UpdateTicketRequest,
  UpdateTicketResponse
} from "@/types/ticket";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Get token from localStorage for authenticated requests
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const ticketApi = createApi({
  reducerPath: "ticketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      headers.set("content-type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Ticket"],
  endpoints: (builder) => ({
    // Get all tickets
    getTickets: builder.query<GetTicketsResponse, { label?: string } | void>({
      query: () => {
        return `/tickets`;
      },
      providesTags: ["Ticket"],
    }),

    // Create a new ticket
    createTicket: builder.mutation<CreateTicketResponse, CreateTicketRequest>({
      query: (ticket) => ({
        url: "/tickets",
        method: "POST",
        body: ticket,
      }),
    }),

    // Update a ticket
    updateTicket: builder.mutation<UpdateTicketResponse, { id: string; data: UpdateTicketRequest }>({
      query: ({ id, data }) => ({
        url: `/tickets/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

  }),
});

export const {
  useGetTicketsQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
} = ticketApi;

