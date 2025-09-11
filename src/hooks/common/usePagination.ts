import { useState } from "react";

interface UsePaginationOptions {
  initialPage?: number;
  itemsPerPage?: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, itemsPerPage = 10 } = options;
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNext = (pagination: PaginationData) => {
    if (pagination.hasNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevious = (pagination: PaginationData) => {
    if (pagination.hasPrev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const reset = () => {
    setCurrentPage(initialPage);
  };

  const getParams = () => ({
    page: currentPage,
    limit: itemsPerPage,
  });

  return {
    currentPage,
    itemsPerPage,
    goToPage,
    goToNext,
    goToPrevious,
    reset,
    getParams,
  };
}
