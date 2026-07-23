"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Download,
  Loader2,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useDeleteAdminUserDetailMutation,
  useExportUsersCsvMutation,
  useGetPlansQuery,
  useGetUsersQuery,
  useUpdateAdminUserDetailMutation,
} from "@/lib/authApi";

type FilterTab = "all" | "free" | "paid" | "high";

const filterTabs: { label: string; key: FilterTab }[] = [
  { label: "All Users", key: "all" },
  { label: "Free Users", key: "free" },
  { label: "Paid Users", key: "paid" },
  { label: "High Usage", key: "high" },
];

const packageStyles: Record<string, string> = {
  Free: "bg-[#eef2f7] text-[#283445]",
  Standard: "bg-[#eef2f7] text-[#283445]",
};

const getPackageStyle = (pkg: string) => {
  if (packageStyles[pkg]) return packageStyles[pkg];
  if (pkg.toLowerCase() === "free") return "bg-[#eef2f7] text-[#283445]";
  return "bg-[#eef4ff] text-[#2563eb]";
};

const usageStyles: Record<string, string> = {
  Low: "bg-[#dcfce7] text-[#16a34a]",
  Medium: "bg-[#fef3c7] text-[#b45309]",
  High: "bg-[#ffe1e1] text-[#ef5b5e]",
  "Very High": "bg-[#ffe1e1] text-[#ef5b5e]",
};

const statusStyles: Record<string, string> = {
  Active: "bg-[#dcfce7] text-[#16a34a]",
  Inactive: "bg-[#eef2f7] text-[#1f2937]",
};

// Helper to extract initials from full_name
const getInitials = (name: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const USERS_PER_PAGE = 10;

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetching live users and real plans from API
  const { data: apiUsers, isLoading, isError } = useGetUsersQuery();
  const { data: apiPlans } = useGetPlansQuery();

  const [exportUsersCsv, { isLoading: isExporting }] =
    useExportUsersCsvMutation();
  const [updateUser, { isLoading: isUpdating }] =
    useUpdateAdminUserDetailMutation();
  const [deleteUser, { isLoading: isDeleting }] =
    useDeleteAdminUserDetailMutation();

  // Edit & Delete state
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    package: "Free",
    status: "active",
  });
  const [deletingUser, setDeletingUser] = useState<any | null>(null);

  // Extract real plan list from /api/plan-list/
  const planList = useMemo(() => {
    if (!apiPlans) return [];
    const list = Array.isArray(apiPlans)
      ? apiPlans
      : Array.isArray((apiPlans as any).results)
        ? (apiPlans as any).results
        : Array.isArray((apiPlans as any).data)
          ? (apiPlans as any).data
          : [];
    return list;
  }, [apiPlans]);

  // Normalizing API user data
  const users = useMemo(() => {
    if (!apiUsers) return [];

    const userList = Array.isArray(apiUsers)
      ? apiUsers
      : apiUsers && Array.isArray(apiUsers.results)
        ? apiUsers.results
        : apiUsers && Array.isArray(apiUsers.data)
          ? apiUsers.data
          : [];

    return userList.map((user: any) => {
      let rawPkg = user.package || user.pricing_plan?.plan_name || "Free";
      const pkg =
        typeof rawPkg === "string" && rawPkg.length > 0
          ? rawPkg.charAt(0).toUpperCase() + rawPkg.slice(1)
          : "Free";

      const isPaid = pkg.toLowerCase() !== "free";
      const usage = user.usage_level || (isPaid ? "Medium" : "Low");
      const status =
        user.status && user.status.toLowerCase() === "active"
          ? "Active"
          : "Inactive";

      const name =
        user.full_name || user.email?.split("@")[0] || "Unknown User";

      return {
        id: user.id,
        initials: getInitials(name),
        name: user.full_name || "Unknown User",
        email: user.email,
        package: pkg,
        joinDate: user.join_date || "N/A",
        queries: String(user.ai_queries ?? 0),
        usage: usage,
        lastActive: user.last_active || "N/A",
        status: status,
      };
    });
  }, [apiUsers]);

  // Combine real API plans with user packages for dynamic dropdown options
  const availablePlanNames = useMemo(() => {
    const namesFromPlans = planList
      .map((p: any) => p.plan_name || p.name || p.title)
      .filter(Boolean);
    const namesFromUsers = users
      .map((u: any) => u.package)
      .filter(Boolean);

    const set = new Set(["Free", ...namesFromPlans, ...namesFromUsers]);
    return Array.from(set);
  }, [planList, users]);

  const handleExportCsv = async () => {
    try {
      const blob = await exportUsersCsv().unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `users-export-${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Users CSV exported successfully!");
    } catch (err) {
      toast.error("Failed to export users CSV");
      console.error("Export CSV error:", err);
    }
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.name !== "Unknown User" ? user.name : "",
      email: user.email || "",
      package: user.package || "Free",
      status: user.status.toLowerCase() === "active" ? "active" : "inactive",
    });
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await updateUser({
        id: editingUser.id,
        body: {
          full_name: editForm.full_name,
          package: editForm.package,
          status: editForm.status,
          is_active: editForm.status === "active",
        },
      }).unwrap();

      toast.success("User updated successfully!");
      setEditingUser(null);
    } catch (err: any) {
      console.error("Update user error:", err);
      toast.error(
        err?.data?.message ||
          err?.data?.detail ||
          err?.message ||
          "Failed to update user",
      );
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      await deleteUser(deletingUser.id).unwrap();
      toast.success("User deleted successfully!");
      setDeletingUser(null);
    } catch (err: any) {
      console.error("Delete user error:", err);
      toast.error(
        err?.data?.message ||
          err?.data?.detail ||
          err?.message ||
          "Failed to delete user",
      );
    }
  };

  // Dynamic counts calculated from live API data
  const tabCounts = useMemo(
    () => ({
      all: users.length,
      free: users.filter((user: any) => user.package.toLowerCase() === "free")
        .length,
      paid: users.filter((user: any) => user.package.toLowerCase() !== "free")
        .length,
      high: users.filter(
        (user: any) => user.usage === "High" || user.usage === "Very High",
      ).length,
    }),
    [users],
  );

  // Filtering and searching logic
  const visibleUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user: any) => {
      const isFree = user.package.toLowerCase() === "free";
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "free" && isFree) ||
        (activeTab === "paid" && !isFree) ||
        (activeTab === "high" &&
          (user.usage === "High" || user.usage === "Very High"));

      const matchesSearch =
        !normalizedSearch ||
        user.name.toLowerCase().includes(normalizedSearch) ||
        user.email.toLowerCase().includes(normalizedSearch) ||
        user.package.toLowerCase().includes(normalizedSearch) ||
        user.usage.toLowerCase().includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchTerm, users]);

  // Reset pagination to first page when search or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const totalPages = Math.ceil(visibleUsers.length / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * USERS_PER_PAGE;
    return visibleUsers.slice(start, start + USERS_PER_PAGE);
  }, [visibleUsers, currentPage]);

  return (
    <>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[clamp(25px,1.65vw,29px)] font-extrabold leading-tight tracking-normal text-[#151b26]">
            User Management
          </h1>
          <p className="mt-[5px] text-[11px] text-[#4e5b6c]">
            Manage and monitor all users on your platform
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          disabled={isExporting}
          className="flex h-[39px] items-center justify-center gap-2 rounded-md bg-[#ef5b5e] px-[18px] text-[13px] font-bold text-white shadow-sm hover:cursor-pointer transition hover:bg-[#dc4c50] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isExporting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} strokeWidth={2} />
          )}
          <span>Export CSV</span>
        </button>
      </section>

      <section className="mt-[26px] rounded-[10px] border border-[#d9e0e8] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="border-b border-[#edf0f4] px-[22px] py-[18px]">
          <label className="relative block">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa3af]"
              size={15}
              strokeWidth={1.8}
            />
            <input
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-[39px] w-full rounded-md border border-[#d9e0e8] bg-white pl-10 pr-4 text-[13px] text-[#1f2937] outline-none transition placeholder:text-[#9aa3af] focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
            />
          </label>

          <div
            className="mt-[18px] flex flex-wrap items-center gap-[10px]"
            role="tablist"
            aria-label="User filters"
          >
            {filterTabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`h-[36px] rounded-md px-[17px] text-[13px] font-bold transition hover:cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-[#ef5b5e] text-white"
                    : "bg-[#f3f5f8] text-[#2f3b4b] hover:bg-[#e9edf2]"
                }`}
              >
                {tab.label} ({tabCounts[tab.key]})
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf0f4] bg-[#fafbfc] text-[10px] uppercase tracking-wide text-[#6d7480]">
                <th className="px-[22px] py-[15px] font-bold">User</th>
                <th className="px-[16px] py-[15px] font-bold">Package</th>
                <th className="px-[16px] py-[15px] font-bold">Join Date</th>
                <th className="px-[16px] py-[15px] font-bold">AI Queries</th>
                <th className="px-[16px] py-[15px] font-bold">Usage Level</th>
                <th className="px-[16px] py-[15px] font-bold">Last Active</th>
                <th className="px-[16px] py-[15px] font-bold">Status</th>
                <th className="px-[22px] py-[15px] text-right font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Handling Loading State */}
              {isLoading && (
                <tr>
                  <td
                    className="px-[22px] py-[34px] text-center text-[13px] font-semibold text-[#6d7480]"
                    colSpan={8}
                  >
                    Loading users...
                  </td>
                </tr>
              )}

              {/* Handling Error State */}
              {isError && (
                <tr>
                  <td
                    className="px-[22px] py-[34px] text-center text-[13px] font-semibold text-red-500"
                    colSpan={8}
                  >
                    Failed to load user records.
                  </td>
                </tr>
              )}

              {/* Displaying Live Data */}
              {!isLoading &&
                !isError &&
                paginatedUsers.map((user: any) => (
                  <tr
                    key={user.id || user.email}
                    className="border-b border-[#edf0f4] text-[13px] text-[#273244] transition hover:bg-slate-50/50 last:border-b-0"
                  >
                    <td className="px-[22px] py-[14px]">
                      <div className="flex items-center gap-[13px]">
                        <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#ef5b5e] text-[12px] font-bold text-white">
                          {user.initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-[#1f2937]">
                            {user.name}
                          </p>
                          <p className="mt-[3px] text-[12px] text-[#6d7480]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-[16px] py-[14px]">
                      <span
                        className={`inline-flex h-[22px] items-center rounded-full px-[10px] text-[10px] font-bold ${getPackageStyle(user.package)}`}
                      >
                        {user.package}
                      </span>
                    </td>
                    <td className="px-[16px] py-[14px]">{user.joinDate}</td>
                    <td className="px-[16px] py-[14px] font-semibold">
                      {user.queries}
                    </td>
                    <td className="px-[16px] py-[14px]">
                      <span
                        className={`inline-flex h-[22px] items-center rounded-full px-[10px] text-[10px] font-bold ${usageStyles[user.usage]}`}
                      >
                        {user.usage}
                      </span>
                    </td>
                    <td className="px-[16px] py-[14px]">{user.lastActive}</td>
                    <td className="px-[16px] py-[14px]">
                      <span
                        className={`inline-flex h-[22px] items-center rounded-full px-[11px] text-[10px] font-bold ${statusStyles[user.status]}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-[22px] py-[14px] text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(user)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#d9e0e8] text-[#4e5b6c] hover:cursor-pointer transition hover:border-[#ef5b5e] hover:bg-[#fff1f1] hover:text-[#ef5b5e]"
                          title="Edit User"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingUser(user)}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-[#d9e0e8] text-[#4e5b6c] hover:cursor-pointer transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                          title="Delete User"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Fallback for Empty Search/Filter results */}
              {!isLoading && !isError && visibleUsers.length === 0 && (
                <tr>
                  <td
                    className="px-[22px] py-[34px] text-center text-[13px] font-semibold text-[#6d7480]"
                    colSpan={8}
                  >
                    No users match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-[22px] py-[18px]">
          <p className="text-[13px] text-[#4e5b6c]">
            Showing{" "}
            {visibleUsers.length === 0
              ? 0
              : (currentPage - 1) * USERS_PER_PAGE + 1}{" "}
            to {Math.min(currentPage * USERS_PER_PAGE, visibleUsers.length)} of{" "}
            {visibleUsers.length} users
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-[8px]">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="h-[34px] rounded-md border border-[#d9e0e8] bg-white px-[14px] text-[12px] font-semibold text-[#273244] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-[34px] min-w-[34px] rounded-md px-[10px] text-[12px] font-semibold transition cursor-pointer active:scale-98 ${
                      currentPage === page
                        ? "bg-[#ef5b5e] text-white"
                        : "bg-white border border-[#d9e0e8] text-[#273244] hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className="h-[34px] rounded-md border border-[#d9e0e8] bg-white px-[14px] text-[12px] font-semibold text-[#273244] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-98"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b border-[#edf0f4] pb-4">
              <h2 className="text-base font-extrabold text-[#151b26]">
                Edit User Details
              </h2>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-lg p-1 text-[#6d7480] hover:bg-slate-100 hover:text-[#151b26] hover:cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="mt-4 space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6d7480]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.full_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, full_name: e.target.value })
                  }
                  className="mt-1.5 h-[39px] w-full rounded-md border border-[#d9e0e8] bg-white px-3 text-[13px] text-[#1f2937] outline-none transition focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6d7480]">
                  Email Address (Read-only)
                </label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={editForm.email}
                  className="mt-1.5 h-[39px] w-full cursor-not-allowed rounded-md border border-[#d9e0e8] bg-slate-100 px-3 text-[13px] text-[#6d7480] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6d7480]">
                    Package / Plan
                  </label>
                  <select
                    value={editForm.package}
                    onChange={(e) =>
                      setEditForm({ ...editForm, package: e.target.value })
                    }
                    className="mt-1.5 h-[39px] w-full rounded-md border border-[#d9e0e8] bg-white px-3 text-[13px] text-[#1f2937] outline-none transition focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
                  >
                    {availablePlanNames.map((planName) => (
                      <option key={planName} value={planName}>
                        {planName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6d7480]">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="mt-1.5 h-[39px] w-full rounded-md border border-[#d9e0e8] bg-white px-3 text-[13px] text-[#1f2937] outline-none transition focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="h-[36px] rounded-md border border-[#d9e0e8] bg-white px-4 text-[12px] font-semibold text-[#273244] hover:bg-slate-50 hover:cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex h-[36px] items-center gap-2 rounded-md bg-[#ef5b5e] px-4 text-[12px] font-bold text-white transition hover:bg-[#dc4c50] hover:cursor-pointer disabled:opacity-60"
                >
                  {isUpdating && <Loader2 size={14} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl transition-all">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <AlertTriangle size={24} />
            </div>

            <h3 className="mt-4 text-base font-extrabold text-[#151b26]">
              Delete User Account?
            </h3>
            <p className="mt-2 text-[12px] text-[#6d7480]">
              Are you sure you want to delete{" "}
              <strong className="text-[#151b26]">{deletingUser.name}</strong> (
              {deletingUser.email})? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="h-[36px] w-full rounded-md border border-[#d9e0e8] bg-white text-[12px] font-semibold text-[#273244] hover:bg-slate-50 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex h-[36px] w-full items-center justify-center gap-2 rounded-md bg-rose-600 text-[12px] font-bold text-white transition hover:bg-rose-700 hover:cursor-pointer disabled:opacity-60"
              >
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
