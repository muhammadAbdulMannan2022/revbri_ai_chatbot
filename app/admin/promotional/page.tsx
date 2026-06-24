"use client";

import { useState, type FormEvent } from "react";
import { PencilLine, Plus, Trash2, Upload, Check } from "lucide-react";
import {
  Banner,
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "@/lib/authApi";
import { getErrorMessage } from "@/lib/errorUtils";
import { Toaster, toast } from "react-hot-toast";

export default function PromotionalPage() {
  const { data: apiResponse, isLoading, isError, error } = useGetBannersQuery();
  const banners: Banner[] = apiResponse
    ? Array.isArray(apiResponse)
      ? apiResponse
      : Array.isArray((apiResponse as any).data)
        ? (apiResponse as any).data
        : Array.isArray((apiResponse as any).results)
          ? (apiResponse as any).results
          : []
    : [];

  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const [showPromoModal, setShowPromoModal] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<number | null>(null);
  const [deleteBannerId, setDeleteBannerId] = useState<number | null>(null);

  const [expireDate, setExpireDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");

  const formatToDatetimeLocal = (isoString: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60 * 1000);
      return localDate.toISOString().slice(0, 16);
    } catch (e) {
      return "";
    }
  };

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      const formData = new FormData();
      formData.append("is_active", String(!banner.is_active));
      formData.append("expirey_date", banner.expirey_date);
      await updateBanner({ id: banner.id, body: formData }).unwrap();
      toast.success("Banner status updated successfully");
    } catch (err) {
      console.error("Failed to toggle status:", err);
      toast.error("Failed to update status: " + getErrorMessage(err));
    }
  };

  const openAddModal = () => {
    setEditingBannerId(null);
    setExpireDate("");
    setIsActive(true);
    setImageFile(null);
    setImageUrl(null);
    setShowPromoModal(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBannerId(banner.id);
    setExpireDate(formatToDatetimeLocal(banner.expirey_date));
    setIsActive(banner.is_active);
    setImageFile(null);
    setImageUrl(banner.image);
    setTitle(banner.title);
    setShowPromoModal(true);
  };

  const closePromoModal = () => {
    setShowPromoModal(false);
    setEditingBannerId(null);
    setExpireDate("");
    setIsActive(true);
    setImageFile(null);
    setImageUrl(null);
  };

  const confirmDeleteBanner = async () => {
    if (deleteBannerId === null) {
      return;
    }

    try {
      await deleteBanner(deleteBannerId).unwrap();
      toast.success("Banner deleted successfully");
    } catch (err) {
      console.error("Failed to delete banner:", err);
      toast.error("Failed to delete banner: " + getErrorMessage(err));
    } finally {
      setDeleteBannerId(null);
    }
  };

  const submitPromoForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!expireDate) {
      toast.error("Expiry date is required.");
      return;
    }

    if (!imageFile && !imageUrl) {
      toast.error("Thumbnail image is required.");
      return;
    }

    if (!title) {
      toast.error("Title is required.");
      return;
    }

    const formData = new FormData();
    formData.append("expirey_date", new Date(expireDate).toISOString());
    formData.append("is_active", String(isActive));
    formData.append("title", title);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (editingBannerId !== null) {
        await updateBanner({ id: editingBannerId, body: formData }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        await createBanner(formData).unwrap();
        toast.success("Banner created successfully");
      }
      closePromoModal();
    } catch (err: any) {
      console.error("Failed to save banner:", err);
      let errMsg = "Unknown error";
      if (err) {
        if (typeof err === "string") {
          errMsg = err;
        } else if (err.data) {
          if (typeof err.data === "string") {
            errMsg = err.data;
          } else if (typeof err.data === "object") {
            errMsg =
              err.data.detail || err.data.message || JSON.stringify(err.data);
          }
        } else if (err.message) {
          errMsg = err.message;
        } else if (err.error) {
          errMsg = err.error;
        } else {
          try {
            errMsg = JSON.stringify(err);
          } catch (e) {
            errMsg = String(err);
          }
        }
      }
      toast.error("Failed to save banner: " + errMsg);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ef5b5e] border-t-transparent" />
        <p className="text-[13px] font-medium text-[#4e5b6c]">
          Loading banners...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-6 bg-white border border-[#d9e0e8] rounded-[10px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="text-red-500 text-lg font-bold mb-2">
          Failed to load promotional banners
        </div>
        <p className="text-[12px] text-[#4e5b6c] max-w-md mb-4 font-medium">
          {getErrorMessage(error) ||
            "Could not retrieve the banner catalog from the server."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="h-[38px] rounded-[6px] bg-[#ef5b5e] px-6 text-[12px] font-extrabold text-white transition hover:bg-[#e65255]"
        >
          Retry
        </button>
      </div>
    );
  }

  const previewSrc = imageFile ? URL.createObjectURL(imageFile) : imageUrl;

  return (
    <>
      <section className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[clamp(25px,1.65vw,29px)] font-extrabold leading-tight tracking-normal text-[#151b26]">
            Promotional Management
          </h1>
          <p className="mt-[6px] text-[12px] text-[#4e5b6c]">
            Create and manage your promotional banners
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex h-[44px] cursor-pointer items-center gap-[10px] rounded-[8px] bg-[#ef5b5e] px-[24px] text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(239,91,94,0.18)] transition hover:bg-[#e65255]"
        >
          <Plus size={17} strokeWidth={2.2} />
          Promo Banner
        </button>
      </section>

      <section className="mt-[33px] rounded-[10px] border border-[#d9e0e8] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="border-b border-[#edf0f4] px-[26px] py-[27px]">
          <h2 className="text-[15px] font-extrabold text-[#151b26]">
            Banners List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf0f4] bg-[#fafbfc] text-[10px] uppercase tracking-wide text-[#6d7480]">
                <th className="w-[36%] px-[26px] py-[15px] text-left font-bold">
                  Banner
                </th>
                <th className="w-[20%] px-[18px] py-[15px] text-center font-bold">
                  Upload Date
                </th>
                <th className="w-[20%] px-[18px] py-[15px] text-center font-bold">
                  Expiry Date
                </th>
                <th className="w-[14%] px-[18px] py-[15px] text-center font-bold">
                  Status
                </th>
                <th className="w-[10%] px-[26px] py-[15px] text-center font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {banners.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-[12px] font-medium text-gray-500"
                  >
                    No promo banners found. Click "Promo Banner" to create one.
                  </td>
                </tr>
              ) : (
                banners.map((banner) => (
                  <tr
                    key={banner.id}
                    className="border-b border-[#edf0f4] text-[12px] font-semibold text-[#1f2937] last:border-b-0"
                  >
                    <td className="px-[26px] py-[14px]">
                      <div className="flex items-center gap-[30px]">
                        <div className="relative h-[40px] w-[76px] shrink-0 overflow-hidden rounded-[6px] bg-[#edf0f4] border border-gray-100 shadow-sm flex items-center justify-center">
                          {banner.image ? (
                            <img
                              src={banner.image}
                              alt={`Promo Banner #${banner.id}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-[10px] text-gray-400 font-bold">
                              No Image
                            </div>
                          )}
                        </div>
                        <span className="font-bold">
                          {banner?.title ? banner?.title : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-[18px] py-[14px] text-center text-gray-600 font-medium">
                      {formatDate(banner.created_at)}
                    </td>
                    <td className="px-[18px] py-[14px] text-center text-gray-600 font-medium">
                      {formatDate(banner.expirey_date)}
                    </td>
                    <td className="px-[18px] py-[14px]">
                      <div className="flex items-center justify-center gap-[12px]">
                        <span
                          className={`inline-flex h-[22px] items-center rounded-full px-[12px] text-[10px] font-extrabold ${
                            banner.is_active
                              ? "bg-[#dcfce7] text-[#16a34a]"
                              : "bg-[#eef2f7] text-[#475569]"
                          }`}
                        >
                          {banner.is_active ? "Active" : "Inactive"}
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={banner.is_active}
                          aria-label={`Toggle status for Banner #${banner.id}`}
                          onClick={() => toggleBannerStatus(banner)}
                          className={`relative h-[18px] w-[33px] rounded-full transition ${
                            banner.is_active ? "bg-[#ef5b5e]" : "bg-[#cbd5e1]"
                          }`}
                        >
                          <span
                            className={`absolute top-1/2 h-[13px] w-[13px] -translate-y-1/2 rounded-full bg-white shadow-sm transition ${
                              banner.is_active ? "right-[3px]" : "left-[3px]"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="px-[26px] py-[14px]">
                      <div className="flex items-center justify-center gap-[20px]">
                        <button
                          type="button"
                          aria-label={`Edit Banner #${banner.id}`}
                          onClick={() => openEditModal(banner)}
                          className="text-[#334155] transition hover:text-[#ef5b5e]"
                        >
                          <PencilLine size={15} strokeWidth={1.9} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete Banner #${banner.id}`}
                          onClick={() => setDeleteBannerId(banner.id)}
                          className="text-[#ef5b5e] transition hover:text-[#dc2626]"
                        >
                          <Trash2 size={15} strokeWidth={1.9} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showPromoModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/65 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-banner-title"
        >
          <form
            onSubmit={submitPromoForm}
            className="w-full max-w-[475px] rounded-[8px] bg-white px-[18px] pb-[24px] pt-[19px] shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
          >
            <h2
              id="promo-banner-title"
              className="text-[16px] font-extrabold text-[#151b26] mb-4"
            >
              {editingBannerId === null
                ? "Add Promo Banner"
                : "Edit Promo Banner"}
            </h2>

            <label className="block">
              <span className="text-[12px] font-extrabold text-[#1f2937]">
                Expiry Date and Time
              </span>
              <input
                type="datetime-local"
                required
                value={expireDate}
                onChange={(event) => setExpireDate(event.target.value)}
                className="mt-[9px] h-[34px] w-full rounded-[7px] border border-[#d9e0e8] px-[11px] text-[11px] text-[#1f2937] outline-none transition focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
              />
            </label>
            <label className="block mt-3">
              <span className="text-[12px] font-extrabold text-[#1f2937]">
                Title for the poster
              </span>
              <input
                type="text"
                required
                value={title != null ? title : ""}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Title"
                className="mt-[9px] h-[34px] w-full rounded-[7px] border border-[#d9e0e8] px-[11px] text-[11px] text-[#1f2937] outline-none transition focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
              />
            </label>

            <div className="mt-[18px]">
              <p className="text-[12px] font-extrabold text-[#1f2937]">
                Thumbnail Image
              </p>
              {previewSrc ? (
                <div className="relative mt-[9px] flex h-[126px] w-full items-center justify-center overflow-hidden rounded-[8px] border border-[#d9e0e8] bg-gray-50">
                  <img
                    src={previewSrc}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImageUrl(null);
                    }}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/85 transition"
                    aria-label="Remove image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <label className="mt-[9px] flex h-[126px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#b8c1cf] text-center transition hover:border-[#ef5b5e] hover:bg-[#fff7f7]">
                  <Upload
                    className="text-[#98a2b3]"
                    size={31}
                    strokeWidth={2}
                  />
                  <span className="mt-[12px] text-[12px] text-[#4b5563]">
                    Click to upload or drag and drop
                  </span>
                  <span className="mt-[6px] text-[10px] text-[#6b7280]">
                    PNG, JPG up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setImageFile(file);
                    }}
                    className="sr-only"
                  />
                </label>
              )}
            </div>

            <div className="mt-[18px] flex items-center gap-[10px]">
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                onClick={() => setIsActive(!isActive)}
                className={`relative h-[18px] w-[33px] rounded-full transition ${
                  isActive ? "bg-[#ef5b5e]" : "bg-[#cbd5e1]"
                }`}
              >
                <span
                  className={`absolute top-1/2 h-[12px] w-[12px] -translate-y-1/2 rounded-full bg-white shadow-sm transition ${
                    isActive ? "right-[3px]" : "left-[3px]"
                  }`}
                />
              </button>
              <span className="text-[11px] font-extrabold text-[#1f2937]">
                Is Active
              </span>
            </div>

            <div className="mt-[18px] grid grid-cols-2 gap-[12px]">
              <button
                type="button"
                onClick={closePromoModal}
                className="h-[30px] rounded-[7px] border border-[#d9e0e8] bg-white text-[11px] font-extrabold text-[#273244] transition hover:bg-[#f8fafc]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="h-[30px] flex items-center justify-center gap-[6px] rounded-[7px] bg-[#ef5b5e] text-[11px] font-extrabold text-white shadow-[0_7px_16px_rgba(239,91,94,0.2)] transition hover:bg-[#e65255] disabled:opacity-60"
              >
                <Check size={11} strokeWidth={2.4} />
                {isCreating || isUpdating ? "Saving..." : "Confirm"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteBannerId !== null && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-banner-title"
        >
          <div className="relative w-full max-w-[385px] rounded-[8px] bg-white px-[31px] pb-[22px] pt-[31px] shadow-[0_18px_42px_rgba(0,0,0,0.2)]">
            <button
              type="button"
              aria-label="Close delete confirmation"
              onClick={() => setDeleteBannerId(null)}
              className="absolute right-[11px] top-[8px] text-[12px] leading-none text-[#5b607a] transition hover:text-[#151b26]"
            >
              x
            </button>

            <h2
              id="delete-banner-title"
              className="text-center text-[14px] font-extrabold leading-tight text-[#565a75]"
            >
              Are You Sure About Deleting Banner?
            </h2>

            <div className="mt-[25px] grid grid-cols-2 gap-[13px]">
              <button
                type="button"
                onClick={() => setDeleteBannerId(null)}
                className="h-[36px] rounded-[5px] border border-[#ff5f63] bg-white text-[10px] font-extrabold text-[#ff5f63] transition hover:bg-[#fff5f5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteBanner}
                className="h-[36px] rounded-[5px] bg-[#ff6669] text-[10px] font-extrabold text-white shadow-[0_8px_18px_rgba(255,102,105,0.32)] transition hover:bg-[#ef5b5e]"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
