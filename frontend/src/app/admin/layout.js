"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../globals.css";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#1e40af",
          color: "white",
          padding: "2rem 1.5rem",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "1.6rem",
              color: "white",
              fontWeight: "600",
            }}
          >
            Admin Panel
          </h2>
          <div
            style={{
              width: "50px",
              height: "3px",
              backgroundColor: "#60a5fa",
              margin: "0.75rem auto",
              borderRadius: "2px",
            }}
          ></div>
        </div>
        <nav style={{ marginTop: "1rem" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  📊
                </span>
                Dashboard
              </Link>
            </li>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/home"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  🏠
                </span>
                Edit Home Page
              </Link>
            </li>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/about"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  ℹ️
                </span>
                Edit About Us
              </Link>
            </li>

            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/departments"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  🏢
                </span>
                Edit Departments
              </Link>
            </li>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/packages"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  🎁
                </span>
                Edit Health Packages
              </Link>
            </li>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/stories"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  📖
                </span>
                Edit Patient Stories
              </Link>
            </li>

            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/bookings"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  📋
                </span>
                Manage Bookings
              </Link>
            </li>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/appointments"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  📅
                </span>
                Manage Appointments
              </Link>
            </li>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/faqs"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  ❓
                </span>
                Manage FAQs
              </Link>
            </li>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/questions"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  ❓
                </span>
                Manage Questions
              </Link>
            </li>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/reports"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  📞
                </span>
                Edit Report Page
              </Link>
            </li>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <Link
                href="/admin/content/feed-backs"
                style={{
                  display: "block",
                  padding: "0.75rem 1rem",
                  textDecoration: "none",
                  color: "#e0f2fe",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  🤩
                </span>
                Feed Backs
              </Link>
            </li>
            <li
              style={{
                marginBottom: "0.5rem",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: "#f87171",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#ef4444")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#f87171")
                }
              >
                <span style={{ marginRight: "0.75rem", fontSize: "1.1rem" }}>
                  🚪
                </span>
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          padding: "2rem",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}
