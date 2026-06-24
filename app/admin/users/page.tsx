"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useGetUsersQuery } from "@/lib/authApi";

// Assuming this is the hook from your RTK Query / data fetching library
// Adjust the import path as needed for your project

type FilterTab = "all" | "free" | "paid" | "high";

const filterTabs: { label: string; key: FilterTab }[] = [
  { label: "All Users", key: "all" },
  { label: "Free Users", key: "free" },
  { label: "Paid Users", key: "paid" },
  { label: "High Usage", key: "high" },
];

const packageStyles: Record<string, string> = {
  Premium: "bg-[#dbeafe] text-[#2563eb]",
  Free: "bg-[#eef2f7] text-[#283445]",
  Business: "bg-[#eadcff] text-[#7c3aed]",
  // Fallback for missing or unknown tiers
  Standard: "bg-[#eef2f7] text-[#283445]",
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

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetching data from your custom hook
  const { data: apiUsers, isLoading, isError } = useGetUsersQuery();

  // 2. Normalizing API data with fallbacks for UI fields missing in the endpoint
  const users = useMemo(() => {
    if (!apiUsers) return [];

    return apiUsers.map((user: any) => {
      // Mocking or mapping fields that the API doesn't explicitly provide yet
      const isPaid = user.userole === "admin"; // Example conditional logic
      const pkg = isPaid ? "Business" : "Free";
      const usage = isPaid ? "High" : "Low";
      const status = user.is_verified ? "Active" : "Inactive";

      return {
        id: user.id,
        initials: getInitials(user.full_name),
        name: user.full_name || "Unknown User",
        email: user.email,
        package: pkg,
        joinDate: "2024-01-15", // Mocked fallback since it's not in the response payload
        queries: isPaid ? "4,120" : "120", // Mocked fallback
        usage: usage,
        lastActive: "Just now", // Mocked fallback
        status: status,
      };
    });
  }, [apiUsers]);

  // 3. Dynamic counts calculated from live API data
  const tabCounts = useMemo(
    () => ({
      all: users.length,
      free: users.filter((user: any) => user.package === "Free").length,
      paid: users.filter((user: any) => user.package !== "Free").length,
      high: users.filter(
        (user: any) => user.usage === "High" || user.usage === "Very High",
      ).length,
    }),
    [users],
  );

  // 4. Filtering and searching logic logic
  const visibleUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user: any) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "free" && user.package === "Free") ||
        (activeTab === "paid" && user.package !== "Free") ||
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

  return (
    <>
      <section>
        <h1 className="text-[clamp(25px,1.65vw,29px)] font-extrabold leading-tight tracking-normal text-[#151b26]">
          User Management
        </h1>
        <p className="mt-[5px] text-[11px] text-[#4e5b6c]">
          Manage and monitor all users on your platform
        </p>
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
                className={`h-[36px] rounded-md px-[17px] text-[13px] font-bold transition ${
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
                <th className="px-[22px] py-[15px] text-right font-bold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Handling Loading State */}
              {isLoading && (
                <tr>
                  <td
                    className="px-[22px] py-[34px] text-center text-[13px] font-semibold text-[#6d7480]"
                    colSpan={7}
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
                    colSpan={7}
                  >
                    Failed to load user records.
                  </td>
                </tr>
              )}

              {/* Displaying Live Data */}
              {!isLoading &&
                !isError &&
                visibleUsers.map((user: any) => (
                  <tr
                    key={user.id || user.email}
                    className="border-b border-[#edf0f4] text-[13px] text-[#273244] last:border-b-0"
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
                        className={`inline-flex h-[22px] items-center rounded-full px-[10px] text-[10px] font-bold ${packageStyles[user.package] || packageStyles.Standard}`}
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
                    <td className="px-[22px] py-[14px] text-right">
                      <span
                        className={`inline-flex h-[22px] items-center rounded-full px-[11px] text-[10px] font-bold ${statusStyles[user.status]}`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}

              {/* Fallback for Empty Search/Filter results */}
              {!isLoading && !isError && visibleUsers.length === 0 && (
                <tr>
                  <td
                    className="px-[22px] py-[34px] text-center text-[13px] font-semibold text-[#6d7480]"
                    colSpan={7}
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
            Showing {visibleUsers.length === 0 ? 0 : 1} to {visibleUsers.length}{" "}
            of {visibleUsers.length} users
          </p>

          <div className="flex items-center gap-[8px]">
            <button className="h-[34px] rounded-md border border-[#d9e0e8] bg-white px-[14px] text-[12px] font-semibold text-[#273244]">
              Previous
            </button>
            <button className="h-[34px] min-w-[34px] rounded-md bg-[#ef5b5e] px-[10px] text-[12px] font-semibold text-white">
              1
            </button>
            <button className="h-[34px] min-w-[34px] rounded-md border border-[#d9e0e8] bg-white px-[10px] text-[12px] font-semibold text-[#273244]">
              2
            </button>
            <button className="h-[34px] rounded-md border border-[#d9e0e8] bg-white px-[14px] text-[12px] font-semibold text-[#273244]">
              Next
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
