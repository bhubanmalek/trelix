import * as yup from 'yup';

export const ticketFormSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  expiryDate: yup
    .string()
    .required('Expiry date is required')
    .test('is-future-date', 'Invalid date', function(value) {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }),
  label: yup
    .string()
    .required('Label is required')
});

export type TicketFormData = yup.InferType<typeof ticketFormSchema>;

