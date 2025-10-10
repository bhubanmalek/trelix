import type { TicketState, Ticket } from "@/types/ticket";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TicketState = {
  tickets: [],
  isLoading: false,
  error: null,
  selectedTicket: null,
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    // Add ticket to store (optimistic update)
    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.push(action.payload);
      state.error = null;
    },
    
    // Update ticket in store (optimistic update)
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      const index = state.tickets.findIndex(ticket => ticket.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
      state.error = null;
    },
    
    // Remove ticket from store (optimistic update)
    removeTicket: (state, action: PayloadAction<string>) => {
      state.tickets = state.tickets.filter(ticket => ticket.id !== action.payload);
      state.error = null;
    },
    
    // Set all tickets
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
      state.error = null;
    },
    
    // Set selected ticket
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addTicket,
  updateTicket,
  removeTicket,
  setTickets,
  setSelectedTicket,
  setLoading,
  setError,
  clearError
} = ticketSlice.actions;

export default ticketSlice.reducer;

