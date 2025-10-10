"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { RootState } from "@/lib/store";
import {
  useCreateTicketMutation,
  useUpdateTicketMutation,
} from "@/lib/store/api/ticketApi";
import {
  addTicket,
  setSelectedTicket,
  updateTicket,
} from "@/lib/store/slices/ticketSlice";
import { ticketFormSchema, type TicketFormData } from "@/schemas/ticketSchema";
import type { Ticket, TicketLabel } from "@/types/ticket";
import { useFormHandler } from "@/hooks/useFormHandler";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { labelOptions } from "@/lib/constants/formOptions";

interface TicketFormProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: Ticket | null;
}

export default function TicketForm({
  isOpen,
  onClose,
  ticket,
}: TicketFormProps) {
  const dispatch = useDispatch();
  const { selectedTicket } = useSelector((state: RootState) => state.ticket);
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const [updateTicketApi, { isLoading: isUpdating }] =
    useUpdateTicketMutation();

  const isEditing = !!ticket;
  const currentTicket = ticket || selectedTicket;

  const handleUpdateTicket = async (data: TicketFormData, ticket: Ticket) => {
    const updatedTicket: Ticket = {
      ...ticket,
      ...data,
      label: data.label,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateTicket(updatedTicket));
    await updateTicketApi({
      id: ticket.id,
      data: {
        title: data.title,
        description: data.description,
        expiryDate: data.expiryDate,
        label: data.label,
      },
    }).unwrap();
  };

  const handleCreateTicket = async (data: TicketFormData) => {
    const newTicket: Ticket = {
      id: Date.now().toString(), // Temporary ID
      title: data.title,
      description: data.description,
      expiryDate: data.expiryDate,
      label: data.label,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addTicket(newTicket));

    const response = await createTicket({
      title: data.title,
      description: data.description,
      expiryDate: data.expiryDate,
      label: data.label,
    }).unwrap();

    if (response.data) {
      dispatch(updateTicket(response.data));
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    errors,
    isSubmitting,
  } = useFormHandler<TicketFormData>({
    schema: ticketFormSchema,
    defaultValues: {
      title: "",
      description: "",
      expiryDate: "",
      label: "bug",
    },
    onSubmit: async data => {
      try {
        if (isEditing && currentTicket) {
          await handleUpdateTicket(data, currentTicket);
        } else {
          await handleCreateTicket(data);
        }

        onClose();
        dispatch(setSelectedTicket(null));
      } catch (error) {
        console.error("Failed to save ticket:", error);
      }
    },
  });

  const watchedLabel = watch("label");

  // Reset form when modal opens/closes or ticket changes which  will be reverts later
  useEffect(() => {
    if (isOpen) {
      if (currentTicket) {
        reset({
          title: currentTicket.title,
          description: currentTicket.description,
          expiryDate: currentTicket.expiryDate,
          label: currentTicket.label,
        });
      } else {
        reset({
          title: "",
          description: "",
          expiryDate: "",
          label: "bug",
        });
      }
    }
  }, [isOpen, currentTicket, reset]);

  const handleClose = () => {
    reset();
    onClose();
    dispatch(setSelectedTicket(null));
  };

  const isLoading = isCreating || isUpdating || isSubmitting;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Ticket" : "Create New Ticket"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to your ticket here. Click save when you're done."
              : "Fill in the details to create a new ticket."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter ticket title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter ticket description"
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              {...register("expiryDate")}
              className={errors.expiryDate ? "border-red-500" : ""}
            />
            {errors.expiryDate && (
              <p className="text-sm text-red-500">
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Select
              value={watchedLabel}
              onValueChange={(value: TicketLabel) => setValue("label", value)}
            >
              <SelectTrigger className={errors.label ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a label" />
              </SelectTrigger>
              <SelectContent>
                {labelOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.label && (
              <p className="text-sm text-red-500">{errors.label.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Ticket"
                  : "Create Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
