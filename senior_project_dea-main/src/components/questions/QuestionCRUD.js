import React from "react";
import QuestionCard from "./QuestionCard";
import QuestionForm from "./QuestionForm";
import GetConfig from '../../Config.js';
import '../componentStyling/textStyling.css';

function QuestionCRUD() {

  //this state holds the data of questions pulled from the database
  const [questionsData, setQuestionData] = React.useState([]);

  //this function sets the question data
  const handleQuestionsData = (data) => {
    setQuestionData(data);
  };

  //this function retrieves all question data from the database
  const retrieveQuestions = () => {
    fetch(GetConfig().SERVER_ADDRESS + "/questions/get/all", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body: JSON.stringify({token: window.localStorage.getItem("token")}),
    })
      .then((res) => res.json())
      .then((data) => {
        handleQuestionsData(data.data);
      })
  };

  //question data is retrieved automatically on initial load of page
  React.useEffect(() => {
    //if questionsData has not been loaded yet, load the questions
    if (questionsData.length === 0) {
      retrieveQuestions();
    }
  });

  //CSS
  const container = {
    mx: "auto",
    paddingTop: "50px",
  };

  return (
    <div className="container" style={container}>

      {/* This is where the Add a New Question Form is rendered */}
      <h1 className='h1-text'>Add a New Question</h1>
      <QuestionForm />

      {/* This is where the Existing Questions are rendered */}
      <div style={{ marginTop: 100 }}>
        <h1 className='h1-text'>Existing Questions</h1>
      </div>
      <div className="container">
        {questionsData.map((entry, index) => (
          <QuestionCard
            key={entry._id}
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
