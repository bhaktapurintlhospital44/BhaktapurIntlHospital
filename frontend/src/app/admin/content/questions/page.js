"use client";

import { useState, useEffect } from "react";
import {
  getQuestions,
  updateQuestion as updateQuestionAPI,
  deleteQuestion as deleteQuestionAPI,
} from "@/lib/api/healthPackages";

import "./page.css";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const updateQuestion = async (id, updateData) => {
    const updated = await updateQuestionAPI(id, updateData);
    setQuestions((prev) => prev.map((q) => (q._id === id ? updated : q)));
  };

  const deleteQuestion = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteQuestionAPI(id);
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    }
  };

  if (loading) {
    return (
      <div className="q-loading">
        <h2>Loading Questions...</h2>
        <p>Loading submitted questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="q-error">
        <h2>Error Loading Questions</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="q-container">
      <h2 className="q-title">Submitted Questions</h2>

      <div className="q-section">
        <div className="q-header">
          <h3>All Submitted Questions</h3>
          <span className="q-badge">{questions.length} Total</span>
        </div>

        {questions.length === 0 ? (
          <div className="q-empty">No questions found.</div>
        ) : (
          <div className="q-list">
            {questions.map((q) => (
              <div key={q._id} className="q-card">
                {/* STATUS */}
                <div
                  className={`q-status ${
                    q.status === "answered" ? "answered" : "pending"
                  }`}
                >
                  {q.status}
                </div>

                <h4 className="q-name">Question from: {q.name}</h4>
                <p className="q-email">Email: {q.email}</p>
                <p className="q-question">Question: {q.question}</p>

                {q.answer && (
                  <div className="q-answerBox">
                    <p className="q-answerTitle">Answer:</p>
                    <p className="q-answerText">{q.answer}</p>
                  </div>
                )}

                <p className="q-date">
                  Submitted: {new Date(q.createdAt).toLocaleString()}
                </p>

                <div className="q-actions">
                  {!q.answer ? (
                    <div className="q-answerRow">
                      <button
                        className="btn-green"
                        onClick={() => {
                          const answer = prompt(
                            "Enter answer:",
                            q.answer || "",
                          );
                          if (answer !== null) {
                            updateQuestion(q._id, {
                              answer,
                              status: "answered",
                            });
                          }
                        }}
                      >
                        Answer
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-blue"
                      onClick={() => {
                        const answer = prompt("Update answer:", q.answer);
                        if (answer !== null) {
                          updateQuestion(q._id, {
                            answer,
                            status: "answered",
                          });
                        }
                      }}
                    >
                      Update Answer
                    </button>
                  )}

                  <button
                    className="btn-orange"
                    onClick={() =>
                      updateQuestion(q._id, {
                        status:
                          q.status === "answered" ? "pending" : "answered",
                      })
                    }
                  >
                    Toggle Status
                  </button>

                  <button
                    className="btn-red"
                    onClick={() => deleteQuestion(q._id)}
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
