"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Bot, Clock3, FileText, Loader2, ShieldAlert, Upload, X } from "lucide-react";
import {
  useGetKnowledgePdfsQuery,
  useCreateKnowledgePdfMutation,
  useDeleteKnowledgePdfMutation,
  useGetBlockQueriesQuery,
  useCreateBlockQueryMutation,
  useDeleteBlockQueryMutation,
  useGetAiSettingsQuery,
  useUpdateAiSettingsMutation,
  type KnowledgePdf,
  type AiSettingsPatch,
} from "@/lib/authApi";
import toast from "react-hot-toast";

type ResponseLength = "Short" | "Medium" | "Detailed";

type ToneOption = {
  key: "Professional" | "Friendly" | "Formal" | "Casual";
  description: string;
};

const responseLengths: ResponseLength[] = ["Short", "Medium", "Detailed"];

const toneOptions: ToneOption[] = [
  { key: "Professional", description: "Business-focused and formal" },
  { key: "Friendly", description: "Warm and approachable" },
  { key: "Formal", description: "Strictly professional" },
  { key: "Casual", description: "Relaxed and conversational" },
];

const formatCount = (n: number): string => {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return n.toString();
};

const fileTypeBadges = [
  { label: "PDF", className: "bg-[#ffe1e1] text-[#ef5b5e]" },
  { label: "DOCX", className: "bg-[#e0f2fe] text-[#2563eb]" },
  { label: "TXT", className: "bg-[#fef3c7] text-[#b45309]" },
  { label: "CSV", className: "bg-[#dcfce7] text-[#16a34a]" },
];

// Map response_style from API → tone key used in UI
const styleToTone = (s: string): ToneOption["key"] => {
  const map: Record<string, ToneOption["key"]> = {
    formal: "Formal",
    casual: "Casual",
    friendly: "Friendly",
    professional: "Professional",
    technical: "Professional",
    concise: "Professional",
  };
  return map[s?.toLowerCase()] ?? "Professional";
};

const toneToStyle = (t: ToneOption["key"]) => t.toLowerCase();

export default function AiControlsPage() {
  // ── API hooks ────────────────────────────────────────────────────────────────
  const { data: aiSettings } = useGetAiSettingsQuery();
  const [updateSettings, { isLoading: isSavingSettings }] = useUpdateAiSettingsMutation();

  const { data: pdfsData, isLoading: isPdfsLoading } = useGetKnowledgePdfsQuery();
  const [createPdf, { isLoading: isUploadingPdf }] = useCreateKnowledgePdfMutation();
  const [deletePdf] = useDeleteKnowledgePdfMutation();
  const pdfs: KnowledgePdf[] = pdfsData?.results ?? [];

  const { data: blockData, isLoading: isBlockLoading } = useGetBlockQueriesQuery();
  const [createBlockQuery] = useCreateBlockQueryMutation();
  const [deleteBlockQuery] = useDeleteBlockQueryMutation();
  const blockQueries = blockData?.results ?? [];

  // ── Local UI state ───────────────────────────────────────────────────────────
  const [responseLength, setResponseLength] = useState<ResponseLength>("Medium");
  const [tone, setTone] = useState<ToneOption["key"]>("Professional");
  const [restriction, setRestriction] = useState("");
  const [synced, setSynced] = useState(false);

  // Sync AI settings once they load
  if (aiSettings && !synced) {
    setTone(styleToTone(aiSettings.response_style));
    setRestriction(aiSettings.ai_restriction ?? "");
    setSynced(true);
  }

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [keywordInput, setKeywordInput] = useState("");

  const trimmedKeyword = keywordInput.trim();
  const keywordExists = useMemo(
    () =>
      trimmedKeyword.length > 0 &&
      blockQueries.some((q) => q.word === trimmedKeyword.toLowerCase()),
    [blockQueries, trimmedKeyword],
  );

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleToneChange = async (newTone: ToneOption["key"]) => {
    setTone(newTone);
    try {
      await updateSettings({ response_style: toneToStyle(newTone) }).unwrap();
      toast.success(`Tone updated to ${newTone}`);
    } catch {
      toast.error("Failed to update tone");
    }
  };

  const handleSaveSettings = async () => {
    const patch: AiSettingsPatch = {
      ai_restriction: restriction,
      response_style: toneToStyle(tone),
    };
    try {
      await updateSettings(patch).unwrap();
      toast.success("AI settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const handlePdfUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!pdfFile) { toast.error("Select a PDF first."); return; }
    const fd = new FormData();
    fd.append("file", pdfFile);
    fd.append("is_active", "true");
    try {
      await createPdf(fd).unwrap();
      toast.success("File uploaded successfully");
      setPdfFile(null);
    } catch {
      toast.error("Failed to upload file");
    }
  };

  const handleDeletePdf = async (id: number, name: string) => {
    try {
      await deletePdf(id).unwrap();
      toast.success(`"${name}" removed`);
    } catch {
      toast.error("Failed to remove file");
    }
  };

  const addKeyword = async () => {
    if (!trimmedKeyword || keywordExists) return;
    try {
      await createBlockQuery({ word: trimmedKeyword.toLowerCase() }).unwrap();
      toast.success(`"${trimmedKeyword}" blocked`);
      setKeywordInput("");
    } catch {
      toast.error("Failed to add keyword");
    }
  };

  const removeKeyword = async (id: number, word: string) => {
    try {
      await deleteBlockQuery(id).unwrap();
      toast.success(`"${word}" unblocked`);
    } catch {
      toast.error("Failed to remove keyword");
    }
  };

  // ── Stat cards (real data where available) ────────────────────────────────────
  const statCards = [
    {
      label: "Total Queries Today",
      value: aiSettings ? formatCount(aiSettings.today_query_count) : "—",
      icon: Bot,
      accent: "text-[#2563eb]",
      bg: "bg-[#eef4ff]",
    },
    {
      label: "Total All-Time Queries",
      value: aiSettings ? formatCount(aiSettings.total_query_count) : "—",
      icon: Clock3,
      accent: "text-[#16a34a]",
      bg: "bg-[#eafaf1]",
    },
    {
      label: "Blocked Keywords",
      value: blockData ? formatCount(blockData.count) : "—",
      icon: ShieldAlert,
      accent: "text-[#ef5b5e]",
      bg: "bg-[#fff1f1]",
    },
  ];

  const fileName = (url: string) => decodeURIComponent(url.split("/").pop() ?? url);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 -top-[30px] h-[180px] rounded-[24px] bg-[radial-gradient(75%_120%_at_15%_0%,#ffffff_0%,#f3f5f9_55%,#edf1f7_100%)]" />

      <section className="relative animate-fade-up">
        <h1 className="text-[clamp(24px,1.6vw,28px)] font-extrabold leading-tight text-[#151b26]">
          AI Controls
        </h1>
        <p className="mt-[5px] text-[11px] text-[#4e5b6c]">
          Configure and monitor AI system settings
        </p>
      </section>

      {/* ── Stat cards ── */}
      <section
        className="relative mt-[20px] grid gap-[14px] md:grid-cols-2 xl:grid-cols-3 animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.label}
              className="flex items-center justify-between rounded-[9px] border border-[#d9e0e8] bg-white px-[18px] py-[16px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
            >
              <div>
                <div className={`flex h-[30px] w-[30px] items-center justify-center rounded-[8px] ${card.bg} ${card.accent}`}>
                  <Icon size={15} strokeWidth={2} />
                </div>
                <p className="mt-[10px] text-[10px] font-semibold text-[#647084]">{card.label}</p>
                <p className="mt-[3px] text-[20px] font-extrabold text-[#111827]">{card.value}</p>
              </div>
              <div className="text-[9px] font-semibold text-[#8b95a5]">Updated</div>
            </article>
          );
        })}
      </section>

      {/* ── Main grid ── */}
      <section
        className="relative mt-[20px] grid gap-[20px] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] animate-fade-up"
        style={{ animationDelay: "140ms" }}
      >
        {/* Left column */}
        <div className="space-y-[18px]">
          {/* AI Response Controls (response length — local UI only for now) */}
          <article className="rounded-[10px] border border-[#d9e0e8] bg-white px-[20px] py-[18px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <h2 className="text-[12px] font-extrabold text-[#111827]">AI Response Controls</h2>
            <p className="mt-[4px] text-[10px] text-[#6d7480]">Control the length of AI responses</p>
            <div className="mt-[14px] grid grid-cols-3 gap-[10px]" role="radiogroup" aria-label="Response length">
              {responseLengths.map((option) => {
                const isActive = responseLength === option;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setResponseLength(option)}
                    className={`h-[34px] rounded-[7px] text-[11px] font-bold transition ${
                      isActive
                        ? "border border-[#ef5b5e] bg-[#fff1f1] text-[#ef5b5e]"
                        : "border border-[#e1e6ec] text-[#1f2937] hover:border-[#f5b3b5]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </article>

          {/* AI Knowledge Upload — real API */}
          <article className="rounded-[10px] border border-[#d9e0e8] bg-white px-[20px] py-[18px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <h2 className="text-[12px] font-extrabold text-[#111827]">AI Knowledge Upload</h2>
            <p className="mt-[4px] text-[10px] text-[#6d7480]">Upload documents to train your AI assistant</p>

            <form onSubmit={handlePdfUpload}>
              <label className="mt-[12px] flex cursor-pointer items-center justify-center gap-[10px] rounded-[8px] border border-dashed border-[#d6dbe2] bg-[#fafbfc] px-[14px] py-[16px] text-[11px] font-semibold text-[#5b6472] transition hover:border-[#ef5b5e]">
                <input
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                />
                <Upload size={16} strokeWidth={2} className="text-[#ef5b5e]" />
                {pdfFile ? pdfFile.name : "Upload File"}
              </label>

              {pdfFile && (
                <button
                  type="submit"
                  disabled={isUploadingPdf}
                  className="mt-[8px] flex w-full h-[32px] items-center justify-center gap-[6px] rounded-[7px] bg-[#ef5b5e] text-[11px] font-extrabold text-white transition hover:bg-[#e65255] disabled:opacity-60"
                >
                  {isUploadingPdf ? <Loader2 size={12} className="animate-spin" /> : null}
                  {isUploadingPdf ? "Uploading…" : "Confirm Upload"}
                </button>
              )}
            </form>

            <div className="mt-[10px] flex flex-wrap items-center gap-[8px] text-[9px] font-semibold text-[#6d7480]">
              <span>Supported formats:</span>
              {fileTypeBadges.map((badge) => (
                <span key={badge.label} className={`inline-flex h-[18px] items-center rounded-full px-[8px] ${badge.className}`}>
                  {badge.label}
                </span>
              ))}
            </div>

            <div className="mt-[14px]">
              <p className="text-[10px] font-semibold text-[#6d7480]">Uploaded Files</p>
              {isPdfsLoading ? (
                <div className="mt-[10px] flex items-center gap-2 text-[10px] text-[#94a3b8]">
                  <Loader2 size={12} className="animate-spin" /> Loading…
                </div>
              ) : (
                <ul className="mt-[10px] space-y-[10px]">
                  {pdfs.length === 0 && (
                    <li className="text-[10px] text-[#9aa3af]">No files uploaded yet.</li>
                  )}
                  {pdfs.map((pdf) => {
                    const name = fileName(pdf.file);
                    const ext = name.split(".").pop()?.toUpperCase() ?? "FILE";
                    return (
                      <li
                        key={pdf.id}
                        className="flex items-center justify-between rounded-[8px] border border-[#edf0f4] bg-white px-[12px] py-[10px] text-[10px]"
                      >
                        <div className="flex items-center gap-[10px]">
                          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] bg-[#f1f5f9] text-[#5b6472]">
                            <FileText size={14} strokeWidth={2} />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-[#1f2937] truncate max-w-[220px]">{name}</p>
                            <p className="text-[9px] text-[#8a94a6]">{ext}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-[14px]">
                          <span className={`inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[9px] font-semibold ${pdf.is_active ? "bg-[#ecfdf3] text-[#16a34a]" : "bg-[#fff7ed] text-[#c2410c]"}`}>
                            <span className={`h-[6px] w-[6px] rounded-full ${pdf.is_active ? "bg-[#22c55e]" : "bg-[#f97316]"}`} />
                            {pdf.is_active ? "Uploaded" : "Inactive"}
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove ${name}`}
                            onClick={() => handleDeletePdf(pdf.id, name)}
                            className="text-[#ef5b5e] transition hover:text-[#dc2626]"
                          >
                            <X size={12} strokeWidth={2.2} />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </article>
        </div>

        {/* Right column */}
        <div className="space-y-[18px]">
          {/* AI Tone — saves to response_style */}
          <article className="rounded-[10px] border border-[#d9e0e8] bg-white px-[20px] py-[18px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <h2 className="text-[12px] font-extrabold text-[#111827]">AI Tone &amp; Personality</h2>
            <p className="mt-[4px] text-[10px] text-[#6d7480]">Select the AI communication style</p>
            <div className="mt-[12px] space-y-[10px]" role="radiogroup" aria-label="Tone and personality">
              {toneOptions.map((option) => {
                const isActive = tone === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    disabled={isSavingSettings}
                    onClick={() => handleToneChange(option.key)}
                    className={`flex w-full items-center justify-between gap-[10px] rounded-[9px] border px-[12px] py-[10px] text-left transition disabled:opacity-60 ${
                      isActive ? "border-[#ef5b5e] bg-[#fff5f5]" : "border-[#e6eaf0] bg-white hover:border-[#f5b3b5]"
                    }`}
                  >
                    <div>
                      <p className="text-[11px] font-semibold text-[#1f2937]">{option.key}</p>
                      <p className="mt-[2px] text-[9px] text-[#8a94a6]">{option.description}</p>
                    </div>
                    <span className={`flex h-[16px] w-[16px] items-center justify-center rounded-full border ${isActive ? "border-[#ef5b5e] bg-[#ef5b5e]" : "border-[#d9dee6]"}`}>
                      <span className={`h-[6px] w-[6px] rounded-full ${isActive ? "bg-white" : "bg-transparent"}`} />
                    </span>
                  </button>
                );
              })}
            </div>
          </article>

          {/* AI Restrictions — saves to ai_restriction */}
          <article className="rounded-[10px] border border-[#d9e0e8] bg-white px-[20px] py-[18px] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <h2 className="text-[12px] font-extrabold text-[#111827]">AI Restrictions &amp; Safety</h2>
            <p className="mt-[4px] text-[10px] text-[#6d7480]">Define content restrictions and safety rules</p>
            <label className="mt-[12px] block text-[10px] font-semibold text-[#6d7480]">
              Restriction Description
              <textarea
                rows={6}
                value={restriction}
                onChange={(e) => setRestriction(e.target.value)}
                placeholder="Describe any specific restrictions or safety guidelines for AI responses..."
                className="mt-[8px] w-full rounded-[8px] border border-[#d9e0e8] bg-white px-[12px] py-[10px] text-[11px] text-[#1f2937] outline-none transition placeholder:text-[#9aa3af] focus:border-[#ef5b5e] focus:ring-2 focus:ring-[#fee2e2]"
              />
            </label>
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              className="mt-[10px] flex w-full h-[32px] items-center justify-center gap-[6px] rounded-[7px] bg-[#ef5b5e] text-[11px] font-extrabold text-white transition hover:bg-[#e65255] disabled:opacity-60"
            >
              {isSavingSettings ? <Loader2 size={12} className="animate-spin" /> : null}
              {isSavingSettings ? "Saving…" : "Save Settings"}
            </button>
          </article>
        </div>
      </section>

      {/* ── Blocked Keywords — real API ── */}
      <section
        className="relative mt-[20px] rounded-[10px] border border-[#d9e0e8] bg-white px-[20px] py-[18px] shadow-[0_1px_2px_rgba(15,23,42,0.05)] animate-fade-up"
        style={{ animationDelay: "200ms" }}
      >
        <h2 className="text-[12px] font-extrabold text-[#111827]">Blocked Keywords</h2>
        <p className="mt-[4px] text-[10px] text-[#6d7480]">Add keywords to block from all AI responses</p>

        <div className="mt-[12px] rounded-[8px] border border-[#d9e0e8] bg-white px-[12px] py-[10px]">
          <input
            type="text"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addKeyword();
              }
            }}
            placeholder="Type a keyword and press Enter to add"
            className="w-full text-[11px] text-[#1f2937] outline-none placeholder:text-[#9aa3af]"
          />
        </div>

        <p className="mt-[6px] text-[9px] text-[#9aa3af]">
          Press Enter to add keywords.
          {keywordExists && " Keyword already added."}
        </p>

        <div className="mt-[10px] flex flex-wrap gap-[8px]">
          {isBlockLoading ? (
            <Loader2 size={14} className="animate-spin text-[#ef5b5e]" />
          ) : blockQueries.length === 0 ? (
            <span className="text-[9px] text-[#9aa3af]">No blocked keywords yet.</span>
          ) : blockQueries.map((q) => (
            <span
              key={q.id}
              className="inline-flex items-center gap-[6px] rounded-full bg-[#ffe1e1] px-[10px] py-[4px] text-[9px] font-semibold text-[#ef5b5e]"
            >
              {q.word}
              <button
                type="button"
                aria-label={`Remove ${q.word}`}
                onClick={() => removeKeyword(q.id, q.word)}
                className="text-[#ef5b5e] transition hover:text-[#dc2626]"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
