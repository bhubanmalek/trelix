import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import ticketReducer from "./slices/ticketSlice";
import { authApi } from "./api/authApi";
import { ticketApi } from "./api/ticketApi";

export const rootReducer = combineReducers({
  auth: authReducer,
  ticket: ticketReducer,
  [authApi.reducerPath]: authApi.reducer,
  [ticketApi.reducerPath]: ticketApi.reducer,
});
