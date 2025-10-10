"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import LoginForm from "@/components/auth/LoginForm";
import TicketForm from "@/components/tickets/TicketForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { RootState } from "@/lib/store";
import { useGetTicketsQuery } from "@/lib/store/api/ticketApi";
import { setTickets } from "@/lib/store/slices/ticketSlice";
import type { Ticket } from "@/types/ticket";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const { tickets } = useSelector((state: RootState) => state.ticket);
  const dispatch = useDispatch();
  // Fetch tickets on component mount
  const { data: ticketsData} = useGetTicketsQuery();

  // Update store when API data changes
  useEffect(() => {
    if (ticketsData?.data) {
      dispatch(setTickets(ticketsData.data));
    }
  }, [ticketsData, dispatch]);

  const handleCreateTicket = () => {
    setEditingTicket(null);
    setIsTicketFormOpen(true);
  };

  const handleCloseTicketForm = () => {
    setIsTicketFormOpen(false);
    setEditingTicket(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Task Board</h1>
          <p className="text-gray-600">
            {isAuthenticated
              ? "Welcome to your task management board!"
              : "Please sign in first."}
          </p>
        </div>
        <AuthGuard fallback={<LoginForm />}>
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Tickets</h2>
              <Button
                onClick={handleCreateTicket}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create New Ticket
              </Button>
            </div>
            {JSON.stringify(tickets)}
          </div>
        </AuthGuard>
      </div>

      {/* Ticket Form Modal */}
      <TicketForm
        isOpen={isTicketFormOpen}
        onClose={handleCloseTicketForm}
        ticket={editingTicket}
      />
    </div>
  );
}
