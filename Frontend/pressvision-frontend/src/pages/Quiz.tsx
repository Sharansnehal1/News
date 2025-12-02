import React, { useEffect, useState } from "react";
import { getQuizQuestions } from "../services/quizService";

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load quiz from Strapi
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const data = await getQuizQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("Error loading quiz:", error);
      }
      setLoading(false);
    };

    loadQuiz();
  }, []);

  // Next Question
  const handleNext = () => {
    if (!selected) {
      alert("Please select an option");
      return;
    }
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    setSelected(null);
    setCurrent((prev) => prev + 1);
  };

  // Previous Question
  const handlePrev = () => {
    setCurrent((prev) => prev - 1);
    setSelected(answers[current - 1] || null);
  };

  // Submit Quiz
  const handleSubmit = () => {
    if (!selected) {
      alert("Please select an option");
      return;
    }
    const updated = [...answers];
    updated[current] = selected;
    setAnswers(updated);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h3>Loading Quiz...</h3>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>No quiz questions found in Strapi.</h3>
      </div>
    );
  }

  const score = answers.filter((a, i) => a === questions[i].answer).length;

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-12 col-lg-12">
          <div className="card shadow-lg p-4 rounded-4 border-0">

            <h2 className="text-center text-primary fw-bold mb-4">Quiz Test</h2>

            {!submitted ? (
              <>
                <h4 className="fw-semibold">{questions[current].question}</h4>

                <div className="mt-3">
                  {questions[current].options.map((opt: string, idx: number) => (
                    <div className="form-check mb-2" key={idx}>
                      <input
                        type="radio"
                        className="form-check-input"
                        checked={selected === opt}
                        onChange={() => setSelected(opt)}
                      />
                      <label className="form-check-label">{opt}</label>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between mt-4">
                  {current > 0 && (
                    <button className="btn btn-secondary" onClick={handlePrev}>
                      Previous
                    </button>
                  )}

                  {current < questions.length - 1 ? (
                    <button className="btn btn-primary" onClick={handleNext}>
                      Next
                    </button>
                  ) : (
                    <button className="btn btn-success" onClick={handleSubmit}>
                      Submit Quiz
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center">
                <h3 className="text-success fw-bold">Quiz Completed!</h3>

                <p className="fs-4 mt-3">
                  Your Score: <strong>{score}</strong> / {questions.length}
                </p>

                <button
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    setSubmitted(false);
                    setCurrent(0);
                    setAnswers([]);
                    setSelected(null);
                  }}
                >
                  Retake Quiz
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
