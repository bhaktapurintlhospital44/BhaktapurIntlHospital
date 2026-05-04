"use client";
import { useState, useEffect, useRef } from "react";
import { reportApi } from "@/lib/api/reports";
import styles from "./AdminReports.module.css";

/* ─────────────────────────────────────────────
   Reusable drag-and-drop file picker component
───────────────────────────────────────────── */
function FilePicker({ files, onChange }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const addFiles = (incoming) => {
    const newFiles = Array.from(incoming);
    onChange((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [
        ...prev,
        ...newFiles.filter((f) => !existing.has(f.name + f.size)),
      ];
    });
  };

  const removeFile = (index) => {
    onChange((prev) => prev.filter((_, i) => i !== index));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const fileIcon = (name = "") => {
    const ext = name.split(".").pop().toLowerCase();
    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      xls: "📊",
      xlsx: "📊",
      ppt: "📑",
      pptx: "📑",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      heic: "🖼️",
      mp4: "🎬",
      mov: "🎬",
      webm: "🎬",
    };
    return icons[ext] || "📎";
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? "#4f46e5" : "#cbd5e1"}`,
          borderRadius: "10px",
          padding: "24px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#eef2ff" : "#f8fafc",
          transition: "all 0.2s",
          userSelect: "none",
        }}
      >
        <div style={{ fontSize: "28px", marginBottom: "6px" }}>📂</div>
        <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
          <strong style={{ color: "#4f46e5" }}>Click to browse</strong> or drag
          &amp; drop files here
        </p>
        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#94a3b8" }}>
          PDF, DOCX, XLSX, Images, Videos supported
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Selected files list with × remove buttons */}
      {files.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "10px 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {files.map((file, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "6px 10px",
                fontSize: "13px",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  overflow: "hidden",
                }}
              >
                <span>{fileIcon(file.name)}</span>
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: "#1e293b",
                  }}
                >
                  {file.name}
                </span>
                <span
                  style={{
                    color: "#94a3b8",
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                  }}
                >
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                style={{
                  background: "#fee2e2",
                  color: "#dc2626",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "12px",
                  padding: "2px 8px",
                  marginLeft: "10px",
                  flexShrink: 0,
                }}
              >
                × Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Admin Page
───────────────────────────────────────────── */
export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const [navLabel, setNavLabel] = useState("Reports");
  const [shouldShow, setShouldShow] = useState(false);
  const isDataLoaded = useRef(false); // blocks auto-save until after first loadData

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFiles, setEditFiles] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await reportApi.getAdminReports();
      if (data) {
        setReports(data.reports || []);
        setNavLabel(data.navLabel || "Reports");
        setShouldShow(!!data.shouldShow);
        // Mark data as loaded AFTER setting state so auto-save doesn't fire on these sets
        setTimeout(() => {
          isDataLoaded.current = true;
        }, 0);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Don't auto-save until the initial data has been loaded from the server
    if (!isDataLoaded.current) return;
    const timer = setTimeout(async () => {
      try {
        await reportApi.updateVisibility({ shouldShow, navLabel });
      } catch (err) {
        console.error("Auto-save failed", err);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [shouldShow, navLabel]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Please select at least one file");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("showInSection", String(shouldShow));
    formData.append("navLabel", navLabel);
    files.forEach((f) => formData.append("files", f));
    try {
      await reportApi.createReport(formData);
      setTitle("");
      setDescription("");
      setFiles([]);
      loadData();
    } catch (err) {
      alert("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete permanently?")) return;
    try {
      await reportApi.deleteReport(id);
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleDeleteFile = async (reportId, fileId) => {
    if (!confirm("Delete this file permanently?")) return;
    try {
      await reportApi.deleteSingleFile(reportId, fileId);
      setReports((prev) =>
        prev.map((report) =>
          report._id === reportId
            ? {
                ...report,
                files: report.files.filter((f) => f.fileId !== fileId),
              }
            : report,
        ),
      );
    } catch (err) {
      alert("File delete failed");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("description", editDescription);
    editFiles.forEach((f) => formData.append("files", f));
    try {
      await reportApi.updateReport(editingId, formData);
      setEditingId(null);
      setEditFiles([]);
      loadData();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* ── NAVBAR SETTINGS ── */}
      <div
        className={styles.header}
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          border: "1px solid #eee",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                fontSize: "12px",
                fontWeight: "bold",
                display: "block",
                marginBottom: "4px",
                color: "#64748b",
              }}
            >
              NAVBAR LABEL
            </label>
            <input
              className={styles.inputField}
              value={navLabel}
              onChange={(e) => setNavLabel(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              flexShrink: 0,
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: "bold", color: "#64748b" }}
            >
              NAVBAR VISIBILITY
            </span>
            {/* Styled toggle switch using the CSS classes from page.css */}
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={shouldShow}
                onChange={(e) => setShouldShow(e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
            <span
              style={{
                fontSize: "12px",
                color: shouldShow ? "#10b981" : "#94a3b8",
                fontWeight: "600",
              }}
            >
              {shouldShow ? "Visible" : "Hidden"}
            </span>
          </div>
        </div>
      </div>

      {/* ── CREATE NEW REPORT ── */}
      <div className={styles.formCard}>
        <h3 style={{ marginTop: 0 }}>Create New Report</h3>
        <form onSubmit={handleUploadSubmit}>
          <input
            className={styles.inputField}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              marginBottom: "10px",
              display: "block",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          <textarea
            className={styles.inputField}
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{
              marginBottom: "6px",
              display: "block",
              width: "100%",
              boxSizing: "border-box",
              resize: "vertical",
            }}
          />

          <FilePicker files={files} onChange={setFiles} />

          <button
            type="submit"
            className={styles.submitBtn}
            style={{ marginTop: "16px" }}
            disabled={files.length === 0}
          >
            Publish Report
          </button>
        </form>
      </div>

      {/* ── MANAGE EXISTING REPORTS ── */}
      <div className={styles.formCard}>
        <h3 style={{ marginTop: 0 }}>Manage Existing Reports</h3>
        {reports.length === 0 && (
          <p style={{ color: "#94a3b8" }}>No reports yet.</p>
        )}
        {reports.map((item) => (
          <div
            key={item._id}
            style={{
              padding: "15px",
              borderBottom: "1px solid #eee",
              marginBottom: "10px",
            }}
          >
            {editingId === item._id ? (
              <form onSubmit={handleUpdate}>
                <input
                  className={styles.inputField}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    marginBottom: "8px",
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                />
                <textarea
                  className={styles.inputField}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  style={{
                    marginBottom: "8px",
                    display: "block",
                    width: "100%",
                    boxSizing: "border-box",
                    resize: "vertical",
                  }}
                />

                {/* Existing uploaded files */}
                <div
                  style={{
                    padding: "12px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "11px",
                      fontWeight: "bold",
                      display: "block",
                      marginBottom: "8px",
                      color: "#475569",
                    }}
                  >
                    CURRENT FILES — click × to permanently remove:
                  </label>
                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    {item.files.length === 0 && (
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        No files attached
                      </span>
                    )}
                    {item.files.map((file) => (
                      <div
                        key={file.fileId}
                        style={{
                          background: "#fff",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          border: "1px solid #e2e8f0",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span>📎 {file.fileName}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteFile(item._id, file.fileId)
                          }
                          style={{
                            color: "#dc2626",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "15px",
                            lineHeight: 1,
                            padding: "0 2px",
                          }}
                          title="Remove file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add new files during edit */}
                  <div
                    style={{
                      marginTop: "12px",
                      borderTop: "1px solid #e2e8f0",
                      paddingTop: "10px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        display: "block",
                        marginBottom: "4px",
                        color: "#475569",
                      }}
                    >
                      ADD NEW FILES:
                    </label>
                    <FilePicker
                      key={editingId}
                      files={editFiles}
                      onChange={setEditFiles}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="submit"
                    style={{
                      background: "#28a745",
                      color: "#fff",
                      padding: "6px 16px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "600",
                    }}
                  >
                    Update Report
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditFiles([]);
                    }}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      cursor: "pointer",
                      background: "#fff",
                      color: "#1e293b",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: "0 0 4px" }}>{item.title}</h4>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      margin: "0 0 8px",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      wordBreak: "break-word",
                    }}
                  >
                    {item.description}
                  </p>
                  <div
                    style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
                  >
                    {item.files?.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: "11px",
                          background: "#e9ecef",
                          padding: "2px 8px",
                          borderRadius: "4px",
                        }}
                      >
                        📎 {f.fileName}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexShrink: 0,
                    marginLeft: "12px",
                  }}
                >
                  <button
                    onClick={() => {
                      setEditingId(item._id);
                      setEditTitle(item.title);
                      setEditDescription(item.description);
                      setEditFiles([]);
                    }}
                    style={{
                      padding: "5px 14px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      cursor: "pointer",
                      background: "#fff",
                      color: "#1e293b",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: "6px",
                      border: "1px solid #fca5a5",
                      color: "#dc2626",
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
