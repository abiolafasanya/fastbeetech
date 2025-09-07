"use client";
import { DataTable } from "@/components/ui/data-table";
import { Row } from "@tanstack/react-table";
import useInternshipStatus, {
  InternshipApplication,
} from "./hooks/useInternshipStatus";
import { columns } from "./hooks/useInternshipStatus";
import { Button } from "@/components/ui/button";

const InternshipReviewPage = () => {
  const {
    internshipApplicationsQuery,
    setPage,
    setPageSize,
    setSearch,
    page,
    pageSize,
    search,
    actionLoading,
    handleAction,
  } = useInternshipStatus();

  if (internshipApplicationsQuery.isLoading) return <div>Loading...</div>;
  if (internshipApplicationsQuery.isError)
    return <div>Error: {internshipApplicationsQuery.error?.message}</div>;

  const renderRowActions = (row: Row<InternshipApplication>) => {
    const app = row.original;
    const isAccepting = actionLoading === app._id + "-accept";
    const isRejecting = actionLoading === app._id + "-reject";
    const isMailing = actionLoading === app._id + "-mail";
    const isAnyLoading = !!actionLoading;
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => handleAction(app._id, "accept")}
          disabled={app.status !== "pending" || isAnyLoading}
          className="px-2 py-1 bg-green-500 text-white rounded disabled:opacity-50 flex items-center gap-1"
          title="Accept this application"
        >
          {isAccepting && (
            <span className="loader mr-1 w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          Accept
        </Button>
        <Button
          onClick={() => handleAction(app._id, "reject")}
          disabled={app.status !== "pending" || isAnyLoading}
          className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50 flex items-center gap-1"
          title="Reject this application"
        >
          {isRejecting && (
            <span className="loader mr-1 w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          Reject
        </Button>
        <Button
          onClick={() => handleAction(app._id, "mail")}
          disabled={isAnyLoading}
          className="px-2 py-1 bg-blue-500 text-white rounded flex items-center gap-1 disabled:opacity-50"
          title="Send confirmation email"
        >
          {isMailing && (
            <span className="loader mr-1 w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          Send Mail
        </Button>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Internship Applications Review
      </h1>
      <DataTable
        columns={columns}
        data={internshipApplicationsQuery.data?.data?.data || []}
        renderRowActions={renderRowActions}
        globalFilterPlaceholder="Search name or email..."
        serverPagination
        page={page}
        pageSize={pageSize}
        total={internshipApplicationsQuery.data?.data?.meta?.totalCount || 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        search={search}
        onSearch={setSearch}
      />
    </div>
  );
};

export default InternshipReviewPage;
