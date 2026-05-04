"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

const metadata = {
  title: "Bhaktapur International Hospital",
  description:
    "Modern hospital with advanced medical services and compassionate care.",
};

// ✅ Inject global transition styles once
function injectStyles() {
  if (document.getElementById("nav-transition-styles")) return;
  const style = document.createElement("style");
  style.id = "nav-transition-styles";
  style.textContent = `
    @keyframes progressBar {
      0%   { width: 0%; opacity: 1; }
      70%  { width: 85%; opacity: 1; }
      100% { width: 100%; opacity: 0; }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .page-fade-in {
      animation: fadeIn 0.3s ease forwards;
    }
  `;
  document.head.appendChild(style);
}

// ✅ Show overlay with progress bar + spinner
function showTransitionOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "nav-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: white;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 1;
  `;

  // Progress bar at top
  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
    position: absolute;
    top: 0; left: 0;
    height: 3px;
    background: linear-gradient(90deg, #0b7ac4, #00c6ff);
    animation: progressBar 0.6s ease forwards;
    border-radius: 0 2px 2px 0;
  `;

  // Hospital logo/name text
  const brand = document.createElement("div");
  brand.style.cssText = `
    font-size: 1.1rem;
    font-weight: 600;
    color: #0b7ac4;
    letter-spacing: 0.5px;
    margin-bottom: 16px;
    font-family: sans-serif;
  `;
  brand.textContent = "Bhaktapur International Hospital";

  // Spinner
  const spinner = document.createElement("div");
  spinner.style.cssText = `
    width: 36px;
    height: 36px;
    border: 3px solid #e0f0fb;
    border-top-color: #0b7ac4;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  `;

  overlay.appendChild(progressBar);
  overlay.appendChild(brand);
  overlay.appendChild(spinner);
  document.body.appendChild(overlay);
}

// ✅ Fade in page content after reload
function fadeInPage() {
  document.body.style.opacity = "0";
  document.body.style.transform = "translateY(6px)";
  document.body.style.transition = "opacity 0.3s ease, transform 0.3s ease";

  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.style.opacity = "1";
      document.body.style.transform = "translateY(0)";
    }, 50);
  });
}

export default function RootLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    injectStyles();
    const lastPath = sessionStorage.getItem("lastPath");

    if (lastPath && lastPath !== pathname) {
      // ✅ Navigated to new page — show transition then reload
      sessionStorage.setItem("lastPath", pathname);
      showTransitionOverlay();
      setTimeout(() => {
        window.location.reload();
      }, 100); // slight delay so overlay renders first
    } else {
      // ✅ First load or after reload — fade in smoothly
      sessionStorage.setItem("lastPath", pathname);
      fadeInPage();
    }
  }, [pathname]);

  // ✅ Reload on window resize
  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        window.location.reload();
      }, 500);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
