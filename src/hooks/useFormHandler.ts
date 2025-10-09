import { useForm, UseFormProps, FieldValues, Path } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ObjectSchema } from "yup";

interface UseFormHandlerOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  schema: ObjectSchema<any>;
  onSubmit: (data: T) => Promise<void> | void;
  onError?: (error: any) => void;
}

export function useFormHandler<T extends FieldValues>({
  schema,
  onSubmit,
  onError,
  ...formOptions
}: UseFormHandlerOptions<T>) {
  const form = useForm<T>({
    resolver: yupResolver(schema),
    mode: "onChange",
    ...formOptions,
  });

  const handleSubmit = form.handleSubmit(
    async (data: T) => {
      try {
        await onSubmit(data);
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          // Default error handling
          form.setError("root" as Path<T>, {
            type: "manual",
            message: "An unexpected error occurred. Please try again.",
          });
        }
      }
    },
    (errors) => {
      // Handle validation errors
      console.log("Form validation errors:", errors);
    }
  );

  return {
    ...form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
  };
}
