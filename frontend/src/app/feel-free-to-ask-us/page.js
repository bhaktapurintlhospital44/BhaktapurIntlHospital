"use client";

import { useState, useEffect } from "react";
import { submitQuestion, getFaqs } from "@/lib/api/healthPackages";
import "./page.css";

const fallbackFaqs = [
  {
    question: "Do I need an appointment before visiting?",
    answer:
      "Walk-ins are welcome for emergencies, but we recommend appointments for consultations.",
  },
  {
    question: "What are your OPD hours?",
    answer:
      "Our OPD is generally open from 9:00 AM to 5:00 PM, Sunday to Friday.",
  },
];

export default function FeelFreeToAskUsPage() {
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState(fallbackFaqs);
  const [faqLoading, setFaqLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getFaqs();
        setFaqs(data);
      } catch {
        setFaqs(fallbackFaqs);
      } finally {
        setFaqLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const questionData = {
      name: formData.get("name"),
      email: formData.get("email"),
      question: formData.get("question"),
    };

    try {
      setLoading(true);
      await submitQuestion(questionData);
      alert("Thank you for your question!");
      e.target.reset();
    } catch {
      alert("Error submitting question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <div className="container">
        <div className="header">
          <h1>Feel Free to Ask Us</h1>
          <p>Browse common questions below or send us your own query.</p>
        </div>

        <div className="grid">
          {/* FAQ SECTION */}
          <div className="faqBox">
            <h3>Frequently Asked Questions</h3>

            {faqLoading ? (
              <p className="loadingText">Loading FAQs...</p>
            ) : (
              <ul className="faqList">
                {faqs.map((item) => (
                  <li key={item._id || item.question} className="faqItem">
                    <strong className="faqQ">{item.question}</strong>
                    <br />
                    <span className="faqA">{item.answer}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* FORM SECTION */}
          <div className="formBox">
            <h3>Ask Your Question</h3>

            <form className="form" onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Your Name" required />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
              />
              <textarea
                name="question"
                placeholder="Your Question"
                rows={4}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit Question"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
