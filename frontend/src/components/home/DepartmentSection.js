"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";

export default function DepartmentSection({ departments = [] }) {
  const activeDepartments = departments.filter(
    (dept) => dept?.isActive !== false,
  );

  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  const scroll = (ref, dir) => {
    const container = ref.current;
    if (!container) return;

    const card = container.querySelector(".deptCard");
    if (!card) return;

    const gap = 24;
    const cardWidth = card.offsetWidth + gap;
    const maxScroll = container.scrollWidth - container.clientWidth;

    const atEnd =
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 2;
    const atStart = container.scrollLeft <= 2;

    if (dir === 1 && atEnd) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else if (dir === -1 && atStart) {
      container.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      container.scrollBy({ left: dir * cardWidth, behavior: "smooth" });
    }
  };

  const scrollBoth = (dir) => {
    scroll(row1Ref, dir);
    scroll(row2Ref, dir);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollBoth(1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const mid = Math.ceil(activeDepartments.length / 2);
  const row1 = activeDepartments.slice(0, mid);
  const row2 = activeDepartments.slice(mid);

  const Row = ({ data, refObj }) => (
    <div className="rowWrapper">
      <div className="track" ref={refObj}>
        {data.map((dept) => (
          <Link
            href={`/departments/${dept._id}`}
            key={dept._id}
            className="link"
          >
            <div className="deptCard">
              <img
                src={dept.image || "/placeholder-dept.jpg"}
                className="deptImage"
                alt={dept.name}
              />
              <div className="titleRow">
                {dept.imageIcon && (
                  <img src={dept.imageIcon} className="icon" alt={dept.name} />
                )}
                <h3>{dept.name}</h3>
              </div>
              <p>{dept.description?.substring(0, 90)}...</p>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .rowWrapper {
          position: relative;
          margin-bottom: 1rem;
        }

        .track {
          display: flex;
          gap: 25px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 1rem 3rem;
          scroll-snap-type: x mandatory;
        }

        .track::-webkit-scrollbar {
          display: none;
        }

        .link {
          text-decoration: none;
          color: inherit;
          flex-shrink: 0;
        }

        .deptCard {
          width: calc((100vw - 6rem - 50px) / 3);
          max-width: 370px;
          min-width: 280px;
          background: #fff;
          border-radius: 18px;
          padding: 1.5rem;
          text-align: center;
          scroll-snap-align: start;
          border: 1px solid #080c67;
          transition: 0.3s ease;
          box-sizing: border-box;
        }

        .deptCard:hover {
          transform: translateY(-6px);
          border: 1px solid #18b730;
          box-shadow: 0 18px 35px rgba(0, 0, 0, 0.15);
        }

        .deptImage {
          width: 100%;
          height: 130px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 10px;
        }

        .icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }

        .titleRow {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }

        h3 {
          margin: 0;
          font-size: 0.95rem;
          color: #0b7ac4;
          flex: 1;
          text-align: left;
        }

        p {
          font-size: 0.8rem;
          color: #666;
        }

        /* Tablet: 2 cards */
        @media (max-width: 1024px) {
          .deptCard {
            width: calc((100vw - 6rem - 25px) / 2);
            min-width: 220px;
          }
        }

        /* Mobile: 1 card */
        @media (max-width: 640px) {
          .track {
            padding: 1rem 1.5rem;
            gap: 16px;
          }
          .deptCard {
            width: calc(100vw - 3rem);
            min-width: unset;
            max-width: unset;
            padding: 1rem;
          }
          .deptImage {
            height: 110px;
          }
        }
      `}</style>
    </div>
  );

  return (
    <section style={{ padding: "4rem 0", background: "#f7f9ff" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          color: "#0b7ac4",
          fontSize: "34px",
          fontWeight: "700",
          padding: "0 2rem",
        }}
      >
        Our Departments
      </h2>

      <div
        style={{
          maxWidth: "1200px",
          margin: "auto",
          position: "relative",
          padding: "0 2rem",
          boxSizing: "border-box",
        }}
      >
        <button className="arrow left" onClick={() => scrollBoth(-1)}>
          ❮
        </button>
        <button className="arrow right" onClick={() => scrollBoth(1)}>
          ❯
        </button>

        <Row data={row1} refObj={row1Ref} />
        {row2.length > 0 && <Row data={row2} refObj={row2Ref} />}
      </div>

      <style jsx>{`
        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: white;
          background: rgba(11, 122, 196, 0.9);
          z-index: 50;
        }

        .arrow:hover {
          background: #18b730;
        }

        .left {
          left: 0px;
        }

        .right {
          right: 0px;
        }

        @media (max-width: 640px) {
          .arrow {
            width: 34px;
            height: 34px;
            font-size: 14px;
          }
          .left {
            left: 4px;
          }
          .right {
            right: 4px;
          }
        }
      `}</style>
    </section>
  );
}
