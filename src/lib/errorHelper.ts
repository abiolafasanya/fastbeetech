import { AxiosError } from "axios";
import { toast } from "sonner";

interface ValidationError {
  type: string;
  title: string;
  status: number;
  traceId: string;
  errors: Record<string, string[]>;
}

export const handleServerError = (error: AxiosError, errorMessage?: string) => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ValidationError;

    if (data?.errors) {
      // Flatten all error messages into a single array
      const errorMessages = Object.entries(data.errors)
        .map(([field, messages]) => {
          // Clean up the field name (handle array notation)
          const cleanField = field.replace(/\[\d+\]/g, "");
          // Return formatted messages
          return messages.map((msg) => `${cleanField}: ${msg}`);
        })
        .flat();

      // Display each error message in a separate toast
      errorMessages.forEach((message) => {
        toast.error(message);
      });
      return;
    }

    // Handle non-validation errors
    const message =
      (error.response?.data as {message?: string})?.message ||
      errorMessage ||
      "Operation failed";
    toast.error(message);
    return;
  }
};
