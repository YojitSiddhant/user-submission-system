"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { api, getPublicAssetUrl } from "@/lib/api";
import type { ApiResponse, SubmissionRecord } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Filters = {
  name: string;
  email: string;
};

const PAGE_SIZE = 10;

export function AdminDashboard() {
  const [filters, setFilters] = useState<Filters>({ name: "", email: "" });
  const [rows, setRows] = useState<SubmissionRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.max(Math.ceil(total / PAGE_SIZE), 1);
  const startItem = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const endItem = Math.min((page + 1) * PAGE_SIZE, total);

  const pageSummary = useMemo(() => {
    if (total === 0) {
      return "No submissions";
    }

    return `Showing ${startItem}-${endItem} of ${total}`;
  }, [endItem, startItem, total]);

  async function fetchSubmissions(currentPage = page, currentFilters: Filters = filters) {
    try {
      setError(null);
      const response = await api.get("/submissions", {
        params: {
          name: currentFilters.name.trim() || undefined,
          email: currentFilters.email.trim() || undefined,
          sort: "newest",
          limit: PAGE_SIZE,
          offset: currentPage * PAGE_SIZE,
        },
      });

      const payload = response.data as ApiResponse<SubmissionRecord[]>;
      setRows(payload.data || []);
      setTotal(payload.meta?.total ?? (payload.data || []).length);
    } catch {
      setError("Unable to load submissions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    // Initial data load for the admin list.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchSubmissions(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRefreshing(true);
    setPage(0);
    await fetchSubmissions(0, filters);
  }

  async function goToPage(nextPage: number) {
    setRefreshing(true);
    setPage(nextPage);
    await fetchSubmissions(nextPage, filters);
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this submission?");
    if (!confirmed) return;

    try {
      setRefreshing(true);
      await api.delete(`/submissions/${id}`);

      const nextPage = rows.length === 1 && page > 0 ? page - 1 : page;
      setPage(nextPage);
      await fetchSubmissions(nextPage, filters);
    } catch {
      setError("Unable to delete the submission.");
      setRefreshing(false);
    }
  }

  return (
    <div className="w-full space-y-4">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-lg font-semibold text-slate-900">User Submissions</h1>
      </div>

      <form onSubmit={handleSearch} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <div>
          <label htmlFor="search-name" className="mb-1 block text-sm font-medium text-slate-700">
            Search Name
          </label>
          <Input
            id="search-name"
            placeholder="Search Name"
            value={filters.name}
            onChange={(event) => setFilters((current) => ({ ...current, name: event.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="search-email" className="mb-1 block text-sm font-medium text-slate-700">
            Search Email
          </label>
          <Input
            id="search-email"
            placeholder="Search Email"
            value={filters.email}
            onChange={(event) => setFilters((current) => ({ ...current, email: event.target.value }))}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" loading={refreshing} className="h-11 w-full rounded-md px-5">
            Search
          </Button>
        </div>
      </form>

      <div className="text-sm text-slate-700">Total submissions: {total}</div>

      {loading ? (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Loading submissions...
        </div>
      ) : error ? (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-700">
          {error}
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="max-h-[70vh] overflow-auto">
            <table className="min-w-[1024px] w-full border-separate border-spacing-0 text-sm">
              <thead className="sticky top-0 z-10">
                <tr>
                  {["ID", "Name", "Email", "Phone", "City", "Attachment", "Submitted", "Actions"].map((heading) => (
                    <th
                      key={heading}
                      className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row, index) => {
                    const publicUrl = getPublicAssetUrl(row.attachmentPath);
                    const downloadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050/api"}/submissions/${row.id}/download`;
                    const zebra = index % 2 === 0 ? "bg-white" : "bg-slate-50";

                    return (
                      <tr
                        key={row.id}
                        className={[zebra, "transition-colors hover:bg-slate-100"].join(" ")}
                      >
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{row.id}</td>
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{row.fullName}</td>
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{row.email}</td>
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{row.phone}</td>
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-700">{row.city}</td>
                        <td className="border-b border-slate-100 px-4 py-3">
                          <a href={publicUrl} target="_blank" rel="noreferrer" className="text-slate-900 underline underline-offset-2">
                            👁 View
                          </a>
                          <span className="mx-2 text-slate-300">|</span>
                          <a href={downloadUrl} className="text-slate-900 underline underline-offset-2">
                            ⬇ Download
                          </a>
                        </td>
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-700">
                          {new Date(row.createdAt).toLocaleString()}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-3">
                          <Button variant="danger" onClick={() => void handleDelete(row.id)} className="h-10 rounded-md px-4">
                            🗑 Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-700">{pageSummary}</div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            disabled={page === 0 || refreshing || loading}
            onClick={() => void goToPage(page - 1)}
            className="h-10 rounded-md px-4"
          >
            Previous
          </Button>
          <span className="text-sm text-slate-700">
            Page {total === 0 ? 0 : page + 1} of {totalPages}
          </span>
          <Button
            type="button"
            variant="secondary"
            disabled={page + 1 >= totalPages || refreshing || loading}
            onClick={() => void goToPage(page + 1)}
            className="h-10 rounded-md px-4"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
