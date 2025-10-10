import type { TicketLabel } from "@/types/ticket";

export const labelOptions: { value: TicketLabel; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "to-do", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];
