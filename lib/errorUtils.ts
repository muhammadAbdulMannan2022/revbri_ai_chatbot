export const getErrorMessage = (error: unknown): string => {
  if (!error) return "";
  if (typeof error === "string") return error;

  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    const data = err.data as Record<string, unknown> | undefined;

    if (data?.detail && typeof data.detail === "string") return data.detail;
    if (data?.error && typeof data.error === "string") return data.error;
    if (data?.message && typeof data.message === "string") return data.message;
    if (typeof err.error === "string") return err.error;
    if (typeof err.message === "string") return err.message;
    if (data) return JSON.stringify(data);
  }

  return String(error);
};
