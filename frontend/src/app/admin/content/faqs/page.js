"use client";

import { useState, useEffect } from "react";
import {
  getFaqs,
  createFaq as createFaqAPI,
  updateFaq as updateFaqAPI,
  deleteFaq as deleteFaqAPI,
} from "@/lib/api/healthPackages";

import "./page.css";

export default function FaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", order: 0 });

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getFaqs();
        setFaqs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleCreateFaq = async (e) => {
    e.preventDefault();
    try {
      const createdFaq = await createFaqAPI(newFaq);
      setFaqs((prev) => [...prev, createdFaq]);
      setNewFaq({ question: "", answer: "", order: 0 });
      alert("FAQ created successfully");
    } catch {
      alert("Error creating FAQ");
    }
  };

  const handleUpdateFaq = async (id, updatedData) => {
    try {
      const updatedFaq = await updateFaqAPI(id, updatedData);
      setFaqs((prev) => prev.map((faq) => (faq._id === id ? updatedFaq : faq)));
    } catch {
      alert("Error updating FAQ");
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteFaqAPI(id);
      setFaqs((prev) => prev.filter((f) => f._id !== id));
    }
  };

  if (loading)
    return (
      <div className="centerBox">
        <h2>Loading FAQs...</h2>
      </div>
    );

  if (error)
    return (
      <div className="centerBox error">
        <h2>Error Loading FAQs</h2>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="container">
      <h2 className="mainTitle">Manage FAQs</h2>

      {/* ADD */}
      <div className="card addCard">
        <h3 className="sectionTitle">Add New FAQ</h3>

        <form onSubmit={handleCreateFaq} className="form">
          <input
            value={newFaq.question}
            onChange={(e) =>
              setNewFaq((p) => ({ ...p, question: e.target.value }))
            }
            placeholder="Question"
          />

          <textarea
            value={newFaq.answer}
            onChange={(e) =>
              setNewFaq((p) => ({ ...p, answer: e.target.value }))
            }
            placeholder="Answer"
            rows={3}
          />

          <input
            type="number"
            value={newFaq.order}
            onChange={(e) =>
              setNewFaq((p) => ({
                ...p,
                order: parseInt(e.target.value) || 0,
              }))
            }
            placeholder="Order"
          />

          <button className="primaryBtn">Add FAQ</button>
        </form>
      </div>

      {/* LIST */}
      <div className="card listCard">
        <div className="listHeader">
          <h3 className="sectionTitle">All FAQs</h3>
          <span className="badge">{faqs.length} Total</span>
        </div>

        {faqs.length === 0 ? (
          <p className="empty">No FAQs found.</p>
        ) : (
          <div className="faqList">
            {faqs.map((faq) => (
              <div key={faq._id} className="faqCard">
                <h4 className="q">Q: {faq.question}</h4>
                <p className="a">A: {faq.answer}</p>
                <small className="meta">
                  Order: {faq.order} |{" "}
                  {new Date(faq.createdAt).toLocaleDateString()}
                </small>

                <div className="btnRow">
                  <button
                    className="editBtn"
                    onClick={() => {
                      const q = prompt("Question", faq.question);
                      const a = prompt("Answer", faq.answer);
                      const o = prompt("Order", faq.order);

                      if (q && a && o) {
                        handleUpdateFaq(faq._id, {
                          question: q,
                          answer: a,
                          order: parseInt(o) || 0,
                        });
                      }
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="deleteBtn"
                    onClick={() => handleDeleteFaq(faq._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
