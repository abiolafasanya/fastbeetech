import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  FieldValues,
  FieldPath,
  FieldPathValue,
  UseFormSetValue,
  UseFormClearErrors,
} from "react-hook-form";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const onChangeValidate = <
  TFieldValues extends FieldValues,
  K extends FieldPath<TFieldValues>
>(
  key: K,
  value: FieldPathValue<TFieldValues, K>,
  setValue: UseFormSetValue<TFieldValues>,
  clearErrors: UseFormClearErrors<TFieldValues>
): void => {
  setValue(key, value);
  if (value) {
    clearErrors(key);
  }
};

export function slugify(input: string): string {
  return input
    .toLowerCase() // Convert to lowercase
    .trim() // Remove whitespace from both ends
    .replace(/[^a-z0-9\s-]/g, "") // Remove all non-alphanumeric characters except space and hyphen
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove multiple consecutive hyphens
}

class QueryBuilder {
  private query: string;

  constructor(url: string) {
    this.query = `${url}?`;
  }

  set(key: string, value: string | number | boolean | undefined): this {
    if (value === undefined || value === null || value === "") return this;
    this.query += `${encodeURIComponent(key)}=${encodeURIComponent(
      String(value)
    )}&`;
    return this;
  }

  addParams(
    params: Record<string, string | number | boolean | undefined>
  ): this {
    for (const [key, value] of Object.entries(params)) {
      this.set(key, value);
    }
    return this;
  }

  build(): string {
    return this.query.slice(0, -1);
  }
}

export default QueryBuilder;
