// Ticket types
export interface Ticket {
  id: string;
  title: string;
  description: string;
  expiryDate: string;
  label: TicketLabel;
  createdAt: string;
  updatedAt: string;
}

export type TicketLabel = string;

// Ticket request/response types
export interface CreateTicketRequest {
  title: string;
  description: string;
  expiryDate: string;
  label: TicketLabel;
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  expiryDate?: string;
  label?: TicketLabel;
}

export interface CreateTicketResponse {
  success: boolean;
  data: Ticket;
  error?: string;
}

export interface GetTicketsResponse {
  success: boolean;
  data: Ticket[];
  total: number;
  error?: string;
}

export interface UpdateTicketResponse {
  success: boolean;
  data: Ticket;
  error?: string;
}

// Ticket state types
export interface TicketState {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  selectedTicket: Ticket | null;
}

// Form types
export interface TicketFormData {
  title: string;
  description: string;
  expiryDate: string;
  label: TicketLabel;
}

// Error types
export interface TicketError {
  message: string;
  code?: string;
  field?: string;
}

