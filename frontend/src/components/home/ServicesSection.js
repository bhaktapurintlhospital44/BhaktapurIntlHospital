"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import "../../app/globals.css";

const createUrlFriendlyTitle = (title) => {
  return encodeURIComponent(
    title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, " ")
      .replace(/\s+/g, "-"),
  );
};

function ServiceRow({ services, scrollRef }) {
  return (
    <div
      ref={scrollRef}
      className="service-row"
      style={{
        display: "flex",
        gap: "1.2rem",
        overflowX: "auto",
        scrollBehavior: "smooth",
        padding: "0.5rem 9px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        scrollSnapType: "x mandatory",
      }}
    >
      {services.map((service, index) => (
        <Link
          href={`/services/${createUrlFriendlyTitle(service.title)}`}
          key={index}
          className="service-card-link"
          style={{
            textDecoration: "none",
            color: "inherit",
            flexShrink: 0,
            scrollSnapAlign: "start",
          }}
        >
          <div
            className="service-card"
            style={{
              cursor: "pointer",
              padding: "1.5rem",
              border: "1.5px solid #080c67",
              borderRadius: "12px",
              transition: "transform 0.3s, box-shadow 0.2s, border-color 0.3s",
              textAlign: "center",
              backgroundColor: "white",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
              e.currentTarget.style.borderColor = "#18b730";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#080c67";
            }}
          >
            {service.imageUrl && (
              <img
                src={service.imageUrl}
                alt={service.title}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  marginBottom: "0.8rem",
                  borderRadius: "8px",
                }}
              />
            )}
            <h3
              style={{
                fontSize: "1rem",
                margin: "0.3rem 0",
                fontWeight: "bold",
              }}
            >
              {service.title}
            </h3>
            <p
              style={{
                fontSize: "0.8rem",
                margin: "0.3rem 0",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                color: "#555",
              }}
            >
              {service.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function ServicesSection({ services = [] }) {
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  const midpoint = Math.ceil(services.length / 2);
  const row1 = services.slice(0, midpoint);
  const row2 = services.slice(midpoint);

  const scrollBothRows = (direction) => {
    [row1Ref, row2Ref].forEach((ref) => {
      const el = ref.current;
      if (!el) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2; // 2px tolerance
      const atStart = el.scrollLeft <= 2;

      let next;
      if (direction === "right") {
        next = atEnd ? 0 : el.scrollLeft + el.clientWidth;
      } else {
        next = atStart ? maxScroll : el.scrollLeft - el.clientWidth;
      }

      el.scrollTo({ left: next, behavior: "smooth" });
    });
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        scrollBothRows("right");
      }
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualScroll = (direction) => {
    scrollBothRows(direction);
    startTimer();
  };

  return (
    <section
      className="section"
      style={{ position: "relative", padding: "3rem 0" }}
    >
      <h2 className="section-title">Our Services</h2>

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
        onMouseEnter={() => {
          pausedRef.current = true;
        }}
        onMouseLeave={() => {
          pausedRef.current = false;
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            zIndex: 10,
            pointerEvents: "none",
            padding: "0 5px",
            boxSizing: "border-box",
          }}
        >
          <button onClick={() => handleManualScroll("left")} style={arrowStyle}>
            ❮
          </button>
          <button
            onClick={() => handleManualScroll("right")}
            style={arrowStyle}
          >
            ❯
          </button>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          <ServiceRow services={row1} scrollRef={row1Ref} />
          {row2.length > 0 && (
            <ServiceRow services={row2} scrollRef={row2Ref} />
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .service-row::-webkit-scrollbar { display: none; }
            .service-card-link { width: calc((100% - 2 * 1.2rem) / 3); min-width: 260px; }
            @media (max-width: 1024px) {
              .service-card-link { width: calc((100% - 1.2rem) / 2); min-width: 220px; }
            }
            @media (max-width: 640px) {
              .service-card-link { width: calc(100vw - 48px); padding: 0rem 0rem 0rem 2rem; min-width: unset; }
              .service-card { padding: 1rem !important; }
            }
          `,
        }}
      />
    </section>
  );
}

const arrowStyle = {
  pointerEvents: "auto",
  background: "rgba(11, 122, 196, 0.9)",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "45px",
  height: "45px",
  fontSize: "18px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  transition: "all 0.3s ease",
};
