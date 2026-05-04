"use client";
import { useState, useEffect } from "react";
import { reportApi } from "@/lib/api/reports";
import styles from "./UserReports.module.css";

export default function UserReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState(null);

  // FIX: Use file.fileId (the unique disk name) — NOT file.fileName.
  // The backend route is /api/reports/file/:fileId
  const getViewUrl = (fileId) =>
    `http://localhost:4000/api/reports/file/${fileId}`;
  const getDownloadUrl = (fileId) =>
    `http://localhost:4000/api/reports/file/${fileId}?download=true`;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reportApi.getReports();
        const data = Array.isArray(res) ? res : res?.reports || [];
        setReports(data);
      } catch (err) {
        console.error("Load failed", err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Derive file type from the original fileName for display logic
  const getFileCategory = (fileName = "") => {
    const lower = fileName.toLowerCase();
    if (
      lower.endsWith(".mp4") ||
      lower.endsWith(".mov") ||
      lower.endsWith(".webm")
    )
      return "video";
    if (lower.endsWith(".pdf")) return "pdf";
    if (
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".gif") ||
      lower.endsWith(".webp")
    )
      return "image";
    if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image";
    if (lower.endsWith(".docx") || lower.endsWith(".doc")) return "pdf";
    // XLSX: backend converts to HTML via SheetJS, render in iframe like PDF/DOCX
    if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) return "pdf";
    return "other";
  };

  const handleDownload = (fileId, fileName) => {
    // Create a hidden <a> and programmatically click it.
    // This reliably triggers Save-As even when the browser would otherwise
    // try to open the file inline (common with PDFs and images).
    const a = document.createElement("a");
    a.href = getDownloadUrl(fileId);
    a.download = fileName || fileId;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) return <div className={styles.loader}>Loading reports...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Hospital Reports &amp; Documents</h1>

      {reports.length === 0 ? (
        <p>No reports available at this time.</p>
      ) : (
        <div className={styles.grid}>
          {reports.map((item) => (
            <div key={item._id} className={styles.reportCard}>
              <div className={styles.cardHeader}>
                <h3>{item.title}</h3>
                <p
                  className={styles.description}
                  style={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    wordBreak: "break-word",
                  }}
                >
                  {item.description}
                </p>
              </div>

              <div className={styles.fileList}>
                {item.files?.map((file, i) => (
                  <div key={i} className={styles.fileItem}>
                    <span className={styles.fileName}>
                      {file.fileName || `Document ${i + 1}`}
                    </span>

                    <div className={styles.actionButtons}>
                      {/* VIEW — opens modal using fileId for correct URL */}
                      <button
                        onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          setViewingFile({
                            url: getViewUrl(file.fileId),
                            name: file.fileName,
                            category: getFileCategory(file.fileName),
                          });
                        }}
                        className={styles.viewBtn}
                      >
                        View
                      </button>

                      {/* DOWNLOAD — uses hidden anchor trick to force Save-As */}
                      <button
                        onClick={() =>
                          handleDownload(file.fileId, file.fileName)
                        }
                        className={styles.downloadBtn}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {viewingFile && (
        <div
          className={styles.modalOverlay}
          onClick={() => setViewingFile(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingFile(null)}
              className={styles.closeBtn}
            >
              &times;
            </button>
            <h3 className={styles.modalTitle}>{viewingFile.name}</h3>

            <div className={styles.previewContainer}>
              {/* VIDEO */}
              {viewingFile.category === "video" && (
                <video
                  key={viewingFile.url}
                  controls
                  autoPlay
                  className={styles.videoPlayer}
                >
                  <source src={viewingFile.url} />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* PDF — inline iframe */}
              {viewingFile.category === "pdf" && (
                <iframe
                  src={viewingFile.url}
                  className={styles.iframeViewer}
                  title="Report Preview"
                />
              )}

              {/* IMAGE (jpg/png/gif/webp) and HEIC (backend converts to JPEG) */}
              {viewingFile.category === "image" && (
                <img
                  src={viewingFile.url}
                  alt={viewingFile.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              )}

              {/* FALLBACK for unsupported types */}
              {viewingFile.category === "other" && (
                <div className={styles.noPreview}>
                  <p>Preview not available for this file type.</p>
                  <button
                    onClick={() =>
                      handleDownload(
                        viewingFile.url.split("/").pop().split("?")[0],
                        viewingFile.name,
                      )
                    }
                    className={styles.downloadLink}
                  >
                    Download to View
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
