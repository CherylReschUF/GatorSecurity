import React, { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import QuestionForm from "./QuestionForm";

function QuestionCRUD() {
  const [questionsData, setQuestionData] = useState([]);

  const handleQuestionsData = (data) => {
    setQuestionData(data);
  };

  const retrieveQuestions = () => {
    fetch("http://localhost:5000/questions/get/all", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000/",
      },
      body: JSON.stringify({token: window.localStorage.getItem("token")}),
    })
      .then((res) => res.json())
      .then((data) => {
        handleQuestionsData(data.data);
        console.log(data);
      })
  };

  useEffect(() => {
    retrieveQuestions();
  }, []);

  //CSS
  const container = {
    display: "block",
    mx: "auto",
    paddingTop: "50px",
  };

  const heading = {
    fontFamily: "Gluten",
    color: "#2613fe",
    fontSize: "40px",
    paddingBottom: "50px",
    textDecorationLine: "underline",
  };

  //This is what is rendered to the user
  return (
    <div className="container" style={container}>
      <h4 style={heading}>Add a New Question</h4>
      <QuestionForm />
      <div style={{ marginTop: 100 }}>
        <h4 style={heading}>Existing Questions</h4>
      </div>
      <div className="container">
        {questionsData.map((entry, index) => (
          <QuestionCard
            key={index}
            question_Card={entry.question}
            topic_Card={entry.topic}
            type_Card={entry.type}
            options_Card={entry.options}
            answer_Card={entry.answer}
            id_Card={entry._id}
            displayType_Card={entry.displayType}
          />
        ))}
      </div>
    </div>
  );
}

export default QuestionCRUD;
