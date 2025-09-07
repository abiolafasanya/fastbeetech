"use client";
import InternshipApiInstance from "@/api/InternshipApi";
import { handleServerError } from "@/lib/errorHelper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<InternshipApplication>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => info.getValue(),
    },
  ];

export interface InternshipApplication {
  _id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "rejected";
}

export default function useInternshipStatus() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const internshipApplicationsQuery = useQuery({
    queryKey: ["internship-applications", page, pageSize, search],
    queryFn: async () =>
      InternshipApiInstance.intenshipApplications({ page, pageSize, search }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "accepted" | "rejected";
    }) => InternshipApiInstance.updateStatus({ id, status }),
    onSuccess: (data) => {
      // Optionally invalidate queries or show a success message
      toast.success(
        `Application ${data.data.status === "accepted" ? "accepted" : "rejected"} successfully.`
      );
    },
    onError: (error: unknown) => {
      console.error("Error updating status:", error);
      
      if (error instanceof AxiosError) {
        // handleServerError(error, "Failed to update status");
        toast.error("Failed to update status. Please try again.")
      }
    },
  });

  // toast.success("Confirmation email sent.");
  const sendMailMutation = useMutation({
    mutationFn: async (id: string) => InternshipApiInstance.sendMail(id),
    onSuccess: (data) => {
      console.log("Mail sent successfully:", data);
      toast.success("Confirmation email sent.");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        handleServerError(error, "Failed to send confirmation email");
      }
    },
  });



    const handleAction = async (
      id: string,
      action: "accept" | "reject" | "mail"
    ) => {
      setActionLoading(id + "-" + action);
      try {
        if (action === "accept" || action === "reject") {
          await updateStatusMutation.mutateAsync({
            id,
            status: action === "accept" ? "accepted" : "rejected",
          });
        } else if (action === "mail") {
          await sendMailMutation.mutateAsync(id);
        }
        await internshipApplicationsQuery.refetch();
      } catch (error: unknown) {
        throw error;
      } finally {
        setActionLoading(null);
      }
    };
  return {
    internshipApplicationsQuery,
    updateStatusMutation,
    sendMailMutation,
    setPage,
    setPageSize,
    setSearch,
    setActionLoading,
      handleAction,
    actionLoading,
    page,
    pageSize,
    search,
  };
}
