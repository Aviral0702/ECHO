import React, { useState, useEffect } from "react";

const Matching = () => {
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [wrongAnswer, setWrongAnswer] = useState(false);

  const questions = ["Q1", "Q2", "Q3","Q4"];
  const correctAnswers = { Q1: "A1", Q2: "A2", Q3: "A3" ,Q4:"A4"};
  const options = ["A1", "A2", "A3","A4"];

  const handleQuestionClick = (question) => {
    if (answers[question]) return; // If the question has been answered, make it unclickable
    setSelected(question);
  };

  const handleAnswerClick = (answer) => {
    if (selected && !answers[selected]) {
      if (correctAnswers[selected] === answer) {
        setAnswers({ ...answers, [selected]: answer });
      } else {
        setWrongAnswer(true);
        setTimeout(() => setWrongAnswer(false), 1000); // Flash red for 1 second
      }
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen py-10 bg-gray-100">
    <h1 className="text-3xl font-bold mb-5 text-green-600 ">Match The Following</h1>
      <div className="grid grid-cols-2 gap-10 bg-gray-500 p-10 rounded-lg w-full max-w-2xl mx-auto">
        <div>
          {questions.map((question) => (
            <button
              key={question}
              onClick={() => handleQuestionClick(question)}
              className={`w-full h-32 text-center m-3 text-xl hover: font-bold transition-transform duration-500 ease-in-out transform hover:scale-110 rounded-lg shadow-md ${
                answers[question]
                  ? "bg-green-500 text-white"
                  : selected === question
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {question}
            </button>
          ))}
        </div>
        <div>
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerClick(option)}
              className={`w-full h-32 text-center text-xl m-3 font-bold transition-transform duration-500 ease-in-out transform hover:scale-110 rounded-lg shadow-md ${
                Object.values(answers).includes(option)
                  ? "bg-green-500 text-white"
                  : wrongAnswer
                  ? "bg-red-500 text-white"
                  : "bg-white"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Matching;
