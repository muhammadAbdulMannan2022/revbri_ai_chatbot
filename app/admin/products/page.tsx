"use client";

import { useState, type FormEvent } from "react";
import { Check, PencilLine, Plus, Trash2, Upload } from "lucide-react";
import {
  Product,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/lib/authApi";
import { getErrorMessage } from "@/lib/errorUtils";
import { Toaster, toast } from "react-hot-toast";

type ThumbnailVariant = "package" | "document" | "block";

type ProductForm = {
  name: string;
  productType: string;
  productLink: string;
  description: string;
  productPrice: string;
  isPublished: boolean;
  productImageFile: File | null;
  productImageUrl: string | null;
};

const emptyProductForm: ProductForm = {
  name: "",
  productType: "",
  productLink: "",
  description:
    "We believe this offer will provide you with the best value and meet your expectations. Please let us know if you would like to proceed or if you need any further information. Looking forward to your response.",
  productPrice: "",
  isPublished: true,
  productImageFile: null,
  productImageUrl: null,
};

function ProductThumbnail({ variant }: { variant: ThumbnailVariant }) {
  if (variant === "document") {
    return (
      <div className="flex h-[43px] w-[44px] items-center justify-center overflow-hidden rounded-[2px] bg-[#fafafa] shadow-sm ring-1 ring-[#e5e7eb]">
        <div className="h-[38px] w-[29px] rounded-[1px] border border-[#d9dfe7] bg-white px-[3px] py-[4px]">
          <div className="h-[3px] w-[16px] rounded-full bg-[#f16b6e]" />
          <div className="mt-[5px] space-y-[3px]">
            <div className="h-[2px] w-full rounded-full bg-[#cdd5df]" />
            <div className="h-[2px] w-[18px] rounded-full bg-[#cdd5df]" />
            <div className="h-[2px] w-[20px] rounded-full bg-[#cdd5df]" />
          </div>
          <div className="mt-[5px] h-[10px] rounded-[2px] bg-[#f2c98b]" />
        </div>
      </div>
    );
  }

  if (variant === "block") {
    return (
      <div className="h-[36px] w-[58px] rounded-[2px] bg-[linear-gradient(165deg,#d8dadd_0%,#bfc3c7_52%,#999fa5_53%,#b5bac0_100%)] shadow-sm ring-1 ring-[#d6d9de]" />
    );
  }

  return (
    <div className="relative h-[45px] w-[43px] overflow-hidden rounded-[3px] bg-[#eff3ff] shadow-sm ring-1 ring-[#dce3ef]">
      <div className="absolute inset-x-[5px] top-[4px] h-[10px] rounded-[2px] bg-white shadow-sm" />
      <div className="absolute left-[8px] top-[6px] h-[5px] w-[20px] rounded-full bg-[#ef5b5e]" />
      <div className="absolute inset-x-[4px] top-[17px] h-[11px] rounded-[2px] bg-[#2f3a8f]" />
      <div className="absolute inset-x-[4px] bottom-[3px] h-[13px] rounded-[2px] bg-[repeating-linear-gradient(135deg,#fff_0_3px,#ffd45a_3px_6px)]" />
      <div className="absolute bottom-[8px] left-[13px] h-[11px] w-[16px] rounded-full bg-[#3cb371] ring-2 ring-white" />
    </div>
  );
}

export default function ProductsPage() {
  const { data: apiResponse, isLoading, isError, error } = useGetProductsQuery();
  const products: Product[] = apiResponse
    ? Array.isArray(apiResponse)
      ? apiResponse
      : Array.isArray((apiResponse as any).data)
      ? (apiResponse as any).data
      : Array.isArray((apiResponse as any).results)
      ? (apiResponse as any).results
      : []
    : [];
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);

  const toggleProductStatus = async (product: Product) => {
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("product_type", product.product_type);
      formData.append("link", product.link || "");
      formData.append("description", product.description || "");
      formData.append("product_price", product.product_price || "0");
      formData.append("is_published", String(!product.is_published));
      
      await updateProduct({ id: product.id, body: formData }).unwrap();
      toast.success("Product status updated successfully");
    } catch (err) {
      console.error("Failed to toggle status:", err);
      toast.error("Failed to update status: " + getErrorMessage(err));
    }
  };

  const deleteProductItem = async (productId: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId).unwrap();
        toast.success("Product deleted successfully");
      } catch (err) {
        console.error("Failed to delete product:", err);
        toast.error("Failed to delete product: " + getErrorMessage(err));
      }
    }
  };

  const openAddModal = () => {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setShowAddModal(true);
  };

  const openEditModal = (product: Product) => {
    setShowAddModal(false);
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      productType: product.product_type,
      productLink: product.link ?? "",
      description: product.description ?? emptyProductForm.description,
      productPrice: product.product_price ?? "",
      isPublished: product.is_published,
      productImageFile: null,
      productImageUrl: product.product_image,
    });
  };

  const closeProductModal = () => {
    setShowAddModal(false);
    setEditingProductId(null);
    setProductForm(emptyProductForm);
  };

  const updateProductForm = (updates: Partial<ProductForm>) => {
    setProductForm((currentForm) => ({ ...currentForm, ...updates }));
  };

  const getThumbnailVariant = (productType: string): ThumbnailVariant => {
    const type = productType.toLowerCase();
    if (type === "ecommerce" || type === "e-commerce") {
      return "document";
    }

    if (type === "consultancy") {
      return "block";
    }

    return "package";
  };

  const formatPrice = (price: string) => {
    const val = parseFloat(price);
    if (isNaN(val)) return price || "$0.00";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const submitProductForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!productForm.name.trim()) {
      toast.error("Product name is required.");
      return;
    }
    if (!productForm.productType) {
      toast.error("Product type is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productForm.name.trim());
    formData.append("product_type", productForm.productType);
    formData.append("link", productForm.productLink);
    formData.append("description", productForm.description);
    formData.append("is_published", String(productForm.isPublished));
    formData.append("product_price", productForm.productPrice || "0");

    if (productForm.productImageFile) {
      formData.append("product_image", productForm.productImageFile);
    }

    try {
      if (editingProductId !== null) {
        await updateProduct({ id: editingProductId, body: formData }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData).unwrap();
        toast.success("Product created successfully");
      }
      closeProductModal();
    } catch (err: any) {
      console.error("Failed to save product:", err);
      if (err && typeof err === "object") {
        console.error("Error status code:", err.status);
        console.error("Error response data:", err.data);
        console.error("Error message/string:", err.message || err.error);
      }

      let errMsg = "Unknown error";
      if (err) {
        if (typeof err === "string") {
          errMsg = err;
        } else if (err.data) {
          if (typeof err.data === "string") {
            errMsg = err.data;
          } else if (typeof err.data === "object") {
            errMsg = err.data.detail || err.data.message || JSON.stringify(err.data);
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
      toast.error("Failed to save product: " + errMsg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ef5b5e] border-t-transparent" />
        <p className="text-[13px] font-medium text-[#4e5b6c]">Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-6 bg-white border border-[#d9e0e8] rounded-[10px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="text-red-500 text-lg font-bold mb-2">Failed to load products</div>
        <p className="text-[12px] text-[#4e5b6c] max-w-md mb-4 font-medium">
          {getErrorMessage(error) || "Could not retrieve the product catalog from the server."}
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

  const previewSrc = productForm.productImageFile
    ? URL.createObjectURL(productForm.productImageFile)
    : productForm.productImageUrl;

  return (
    <>
      <section className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[clamp(25px,1.65vw,29px)] font-extrabold leading-tight tracking-normal text-[#151b26]">
            Product Management
          </h1>
          <p className="mt-[6px] text-[12px] text-[#4e5b6c]">
            Create and manage your products
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="flex h-[44px] items-center gap-[10px] rounded-[8px] bg-[#ef5b5e] px-[25px] text-[13px] font-extrabold text-white shadow-[0_8px_18px_rgba(239,91,94,0.18)] transition hover:bg-[#e65255]"
        >
          <Plus size={17} strokeWidth={2.2} />
          Add Product
        </button>
      </section>

      <section className="mt-[32px] rounded-[10px] border border-[#d9e0e8] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="border-b border-[#edf0f4] px-[26px] py-[28px]">
          <h2 className="text-[16px] font-extrabold text-[#151b26]">
            Products List
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#edf0f4] bg-[#fafbfc] text-[10px] uppercase tracking-wide text-[#6d7480]">
                <th className="w-[28%] px-[32px] py-[17px] text-left font-bold">
                  All Products List
                </th>
                <th className="w-[12%] px-[18px] py-[17px] text-center font-bold">
                  Price
                </th>
                <th className="w-[18%] px-[18px] py-[17px] text-center font-bold">
                  Upload Date
                </th>
                <th className="w-[18%] px-[18px] py-[17px] text-center font-bold">
                  Product Type
                </th>
                <th className="w-[14%] px-[18px] py-[17px] text-center font-bold">
                  Status
                </th>
                <th className="w-[10%] px-[26px] py-[17px] text-center font-bold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[12px] font-medium text-gray-500">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#edf0f4] text-[12px] text-[#172033] last:border-b-0"
                  >
                    <td className="px-[32px] py-[17px]">
                      <div className="flex items-center gap-[16px]">
                        <div className="flex h-[54px] w-[62px] shrink-0 items-center justify-center overflow-hidden rounded-[3px]">
                          {product.product_image ? (
                            <img
                              src={product.product_image}
                              alt={product.name}
                              className="h-[45px] w-[45px] rounded-[3px] object-cover border border-[#e5e7eb] shadow-sm"
                            />
                          ) : (
                            <ProductThumbnail variant={getThumbnailVariant(product.product_type)} />
                          )}
                        </div>
                        <span className="font-extrabold truncate max-w-[200px]" title={product.name}>
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-[18px] py-[17px] text-center font-extrabold text-[#111827]">
                      {formatPrice(product.product_price)}
                    </td>

                    <td className="px-[18px] py-[17px] text-center font-medium text-gray-600">
                      {formatDate(product.created_at)}
                    </td>

                    <td className="px-[18px] py-[17px] text-center font-bold capitalize text-gray-700">
                      {product.product_type}
                    </td>

                    <td className="px-[18px] py-[17px]">
                      <div className="flex items-center justify-center gap-[12px]">
                        <span
                          className={`rounded-full px-[13px] py-[5px] text-[10px] font-extrabold ${
                            product.is_published
                              ? "bg-[#dcfce7] text-[#128443]"
                              : "bg-[#f1f5f9] text-[#475569]"
                          }`}
                        >
                          {product.is_published ? "Active" : "Inactive"}
                        </span>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={product.is_published}
                          aria-label={`Toggle ${product.name} status`}
                          onClick={() => toggleProductStatus(product)}
                          className={`relative h-[18px] w-[33px] rounded-full transition ${
                            product.is_published ? "bg-[#ef5b5e]" : "bg-[#cbd5e1]"
                          }`}
                        >
                          <span
                            className={`absolute top-1/2 h-[12px] w-[12px] -translate-y-1/2 rounded-full bg-white shadow-sm transition ${
                              product.is_published ? "right-[3px]" : "left-[3px]"
                            }`}
                          />
                        </button>
                      </div>
                    </td>

                    <td className="px-[26px] py-[17px]">
                      <div className="flex items-center justify-center gap-[24px]">
                        <button
                          type="button"
                          aria-label={`Edit ${product.name}`}
                          onClick={() => openEditModal(product)}
                          className="text-[#2f3b4b] transition hover:text-[#ef5b5e]"
                        >
                          <PencilLine size={14} strokeWidth={1.9} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => deleteProductItem(product.id)}
                          className="text-[#ef4444] transition hover:text-[#dc2626]"
                        >
                          <Trash2 size={14} strokeWidth={1.9} />
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

      {(showAddModal || editingProductId !== null) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <form
            onSubmit={submitProductForm}
            className="relative max-h-[calc(100vh_-_24px)] w-full max-w-[520px] overflow-y-auto rounded-[8px] bg-white shadow-[0_18px_44px_rgba(0,0,0,0.22)]"
          >
            <div className="flex items-center justify-between border-b border-[#edf0f4] px-[18px] py-[18px]">
              <h2
                id="product-modal-title"
                className="text-[18px] font-extrabold text-[#151b26]"
              >
                {editingProductId === null
                  ? "Product Details"
                  : "Edit Product Details"}
              </h2>
              <button
                type="button"
                aria-label="Close product details"
                onClick={closeProductModal}
                className="text-[22px] leading-none text-[#5b6070] transition hover:text-[#151b26]"
              >
                x
              </button>
            </div>

            <div className="px-[18px] pb-[20px] pt-[16px]">
              <label className="block">
                <span className="text-[10px] font-extrabold text-[#1f2937]">
                  Product Name
                </span>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(event) =>
                    updateProductForm({ name: event.target.value })
                  }
                  placeholder="Enter Name"
                  className="mt-[8px] h-[34px] w-full rounded-[6px] border border-[#d9e0e8] px-[11px] text-[11px] font-medium text-[#1f2937] outline-none transition placeholder:text-[#9aa3af] focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
                />
              </label>

              <label className="mt-[14px] block">
                <span className="text-[10px] font-extrabold text-[#1f2937]">
                  Product Type
                </span>
                <select
                  required
                  value={productForm.productType}
                  onChange={(event) =>
                    updateProductForm({
                      productType: event.target.value,
                    })
                  }
                  className="mt-[8px] h-[34px] w-full rounded-[6px] border border-[#d9e0e8] bg-white px-[11px] text-[11px] font-medium text-[#1f2937] outline-none transition focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
                >
                  <option value="">Select One</option>
                  <option value="resource">Resource</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="consultancy">Consultancy</option>
                </select>
              </label>

              <label className="mt-[14px] block">
                <span className="text-[10px] font-extrabold text-[#1f2937]">
                  Product Price ($)
                </span>
                <input
                  type="text"
                  value={productForm.productPrice}
                  onChange={(event) =>
                    updateProductForm({ productPrice: event.target.value })
                  }
                  placeholder="Enter Price (e.g. 29.99)"
                  className="mt-[8px] h-[34px] w-full rounded-[6px] border border-[#d9e0e8] px-[11px] text-[11px] font-medium text-[#1f2937] outline-none transition placeholder:text-[#9aa3af] focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
                />
              </label>

              <label className="mt-[14px] block">
                <span className="text-[10px] font-extrabold text-[#1f2937]">
                  Product Link
                </span>
                <input
                  type="text"
                  value={productForm.productLink}
                  onChange={(event) =>
                    updateProductForm({ productLink: event.target.value })
                  }
                  placeholder="Provide Product Link"
                  className="mt-[8px] h-[34px] w-full rounded-[6px] border border-[#d9e0e8] px-[11px] text-[11px] font-medium text-[#1f2937] outline-none transition placeholder:text-[#9aa3af] focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
                />
              </label>

              <div className="mt-[14px]">
                <p className="text-[10px] font-extrabold text-[#1f2937]">
                  Product Thumbnail Image
                </p>
                {previewSrc ? (
                  <div className="relative mt-[8px] flex h-[120px] w-full items-center justify-center overflow-hidden rounded-[6px] border border-[#d9e0e8] bg-gray-50">
                    <img
                      src={previewSrc}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateProductForm({
                          productImageFile: null,
                          productImageUrl: null,
                        })
                      }
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/85 transition"
                      aria-label="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="mt-[8px] flex h-[120px] cursor-pointer flex-col items-center justify-center rounded-[6px] border border-dashed border-[#aeb7c4] text-center transition hover:border-[#ef5b5e] hover:bg-[#fff7f7]">
                    <Upload className="text-[#98a2b3]" size={28} strokeWidth={2} />
                    <span className="mt-[12px] text-[10px] text-[#4b5563]">
                      Click to upload or drag and drop
                    </span>
                    <span className="mt-[5px] text-[9px] text-[#6b7280]">
                      PNG, JPG up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null;
                        updateProductForm({ productImageFile: file });
                      }}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>

              <label className="mt-[14px] block">
                <span className="text-[10px] font-extrabold text-[#1f2937]">
                  Description
                </span>
                <textarea
                  value={productForm.description}
                  onChange={(event) =>
                    updateProductForm({ description: event.target.value })
                  }
                  className="mt-[8px] h-[68px] w-full resize-none rounded-[6px] border border-[#d9e0e8] px-[10px] py-[8px] text-[10px] leading-[1.35] text-[#7a828f] outline-none transition focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
                />
              </label>

              <div className="mt-[14px] flex items-center gap-[10px]">
                <button
                  type="button"
                  role="switch"
                  aria-checked={productForm.isPublished}
                  onClick={() =>
                    updateProductForm({ isPublished: !productForm.isPublished })
                  }
                  className={`relative h-[18px] w-[33px] rounded-full transition ${
                    productForm.isPublished ? "bg-[#ef5b5e]" : "bg-[#cbd5e1]"
                  }`}
                >
                  <span
                    className={`absolute top-1/2 h-[12px] w-[12px] -translate-y-1/2 rounded-full bg-white shadow-sm transition ${
                      productForm.isPublished ? "right-[3px]" : "left-[3px]"
                    }`}
                  />
                </button>
                <span className="text-[10px] font-extrabold text-[#1f2937]">
                  Is Published / Active
                </span>
              </div>

              <div className="mt-[17px] grid grid-cols-2 gap-[12px] border-t border-[#edf0f4] pt-[17px]">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex h-[30px] items-center justify-center gap-[7px] rounded-[6px] bg-[#ef5b5e] text-[10px] font-extrabold text-white shadow-[0_7px_16px_rgba(239,91,94,0.2)] transition hover:bg-[#e65255] disabled:opacity-60"
                >
                  <Check size={11} strokeWidth={2.4} />
                  {isCreating || isUpdating ? "Saving..." : "Save Product"}
                </button>
                <button
                  type="button"
                  onClick={closeProductModal}
                  className="h-[30px] rounded-[6px] border border-[#d9e0e8] bg-white text-[10px] font-extrabold text-[#273244] transition hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}


