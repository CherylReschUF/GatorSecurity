import { useState } from "react";
import GetConfig from '../../Config.js';
import apiRequest from '../../util/api.js';

export default function QuestionForm() {
  //these states store the data fields for the question being added
  const [newQuestion, setNewQuestion] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newType, setNewType] = useState("");
  const [newOptions, setNewOptions] = useState([""]);
  const [newAnswer, setNewAnswer] = useState("");
  const [newDisplayType, setNewDisplayType] = useState("");
  const [newGameType, setNewGameType] = useState("");

  //CYOA
  const [groupOfQuestions, setGroupOfQuestions] = useState([""]);
  const [groupOfImagePaths, setGroupOfImagePaths] = useState([""]);
  const [groupOfImages, setGroupOfImages] = useState([""]);
  const [groupOfGroupOfAnswers,setGroupOfGroupOfAnswers] = useState([[""]]);
  
  //DND
  const [image, setImage] = useState([""]);
  const [pathOfImage, setPathOfImage] = useState("");

  //MM
  //const [setOfPairsOfAnswers]

  //this function changes the question field
  const handleQuestionChange = (value) => {
    setNewQuestion(value);
  };

  //this function changes the topic field
  const handleTopicChange = (value) => {
    setNewTopic(value);
  };

  //this function changes the display type field
  const handleDisplayTypeChange = (value) => {
    setNewDisplayType(value);
  };

  //this function changes the game type field
  const handleGameTypeChange = (value) => {
    setNewGameType(value);

    if(value === "FITB") {
      handleTypeChange("1");
      console.log('FITB selected')
    }
  }

  //this function makes changes to the type field
  const handleTypeChange = (value) => {
    if (value === "1") {
      let array = [""];
      setNewOptions(array);
      console.log('type set to 1, options set')
    } else if (value === "2") {
      let array = ["True", "False"];
      setNewOptions(array);
    } else {
      let array = ["", ""];
      setNewOptions(array);
    }

    setNewType(value);
  };

  //this function makes changes to the option(s) field(s)
  const handleOptionsChange = (index, value) => {
    let tempOptions = [...newOptions];
    tempOptions[index] = value;
    setNewOptions(tempOptions);
  };

  //this function makes a change to the answer field
  const handleAnswerChange = (value) => {
    setNewAnswer(value);
  };

  //this function adds additional options to the question
  const handleAddOption = () => {
    setNewOptions((options) => [...options, ""]);
  };

   //this function removes options a user does not want/need
  const handleRemoveOption = (value) => {
    let filter = newOptions.filter((option, index) => index !== value);
    setNewOptions(filter);
  };

  //this function makes a call to the database to create a new question
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (newDisplayType === "learn" || newGameType === "FITB") {
      apiRequest("/questions/create", {
        method: "POST",
        body: JSON.stringify({
          question: newQuestion,
          type: newType,
          topic: newTopic,
          options: newOptions,
          answer: newAnswer,
          displayType: newDisplayType,
        }),
      }).then((response) => {
        if(response.status === 500)
        {
          alert("Internal server error. Please try again")
        }
        else if (response.status === 422)
        {
          alert("Please ensure all fields are properly filled out and try again.")
        }
        else if (response.status === 201)
        {
          alert("Question has been added successfully.");
          window.location.reload();
        }
      });
    } else if (newDisplayType === "game") {
      //here will be the fetch function(s) that inserts a new game question

    }
  };

  const text = {
    fontFamily: "Gluten",
    color: "#2C74B3",
  };

  return (
    <div className="card">
      {/* <div>
        DEBUG
        {newDisplayType !== "" && newAnswer !== "" && newQuestion !== "" && newTopic !== "" && newType !== "" && (
          <div>
            Display, Answer, Question, Topic, and Type are all set!
          </div>
        )}
      </div> */}
      <div className="card-body">
        <form onSubmit={handleSubmit}>
        <div
            className="form-group"
            style={{ textAlign: "left", marginTop: 10 }}
          >
            <label htmlFor="form-topic" style={text}>
              Display Type
            </label>
            <select
              required
              className="form-select"
              id="form-topic"
              onChange={(e) => {
                handleDisplayTypeChange(e.target.value);
              }}
            >
              <option value="">Choose a Display Type</option>
              <option value="learn">Learn Page</option>
              <option value="game">Game Page</option>
            </select>
          </div>
          {newDisplayType === "game" && (
            <div
            className="form-group"
            style={{ textAlign: "left", marginTop: 10 }}
            >
              <label htmlFor="form-topic" style={text}>
                Game Type
              </label>
              <select
                required
                className="form-select"
                id="form-topic"
                onChange={(e) => {
                  handleGameTypeChange(e.target.value);
                }}
              >
                <option value="">Choose a Game Type</option>
                <option value="CYOA">Choose Your Own Adventure</option>
                <option value="DND">Drag and Drop</option>
                <option value="MM">Memory Matching</option>
                <option value="FITB">Fill in the Blank</option>
              </select>
              {newGameType === "CYOA" && (
              <div>
                CYOA
              </div>            
              )}
              {newGameType === "DND" && (
              <div>
                DND
              </div>            
              )}
              {newGameType === "MM" && (
              <div>
                MM
              </div>            
              )}
              {newGameType === "FITB" && (
              <div>
                <div className="form-group" style={{ textAlign: "left" }}>
                  <label htmlFor="formQuestion" style={text}>
                    Question
                  </label>
                  <textarea
                    required
                    className="form-control"
                    id="formQuestion"
                    rows="2"
                    placeholder="Enter your question here"
                    onChange={(e) => {
                      handleQuestionChange(e.target.value);
                    }}
                  ></textarea>
                </div>
                <div
                className="form-group"
                style={{ textAlign: "left", marginTop: 10 }}
                >
                  <label htmlFor="form-topic" style={text}>
                    Topic
                  </label>
                  <select
                    required
                    className="form-select"
                    id="form-topic"
                    onChange={(e) => {
                      handleTopicChange(e.target.value);
                    }}
                  >
                    <option value="">Choose a Topic</option>
                    <option value="1">Input Validation</option>
                    <option value="2">Encoding & Escaping</option>
                    <option value="3">Cross-Site Scripting</option>
                    <option value="4">SQL Injection</option>
                    <option value="5">Cryptography</option>
                    <option value="6">User Authentication</option>
                  </select>
                </div>
                <div
                className="form-group"
                style={{ textAlign: "left", marginTop: 10 }}
                >
                  <label htmlFor="form-answer" style={text}>
                    Answer
                  </label>
                  <textarea
                    className="form-control"
                    rows="1"
                    placeholder="Enter your solution to the question here"
                    required
                    onChange={(e) => {
                      handleAnswerChange(e.target.value);
                    }}
                  ></textarea>
                </div>
              </div>            
              )}
            </div>
            
          )}
          {newDisplayType === "learn" && (
            <div>
              <div className="form-group" style={{ textAlign: "left" }}>
                <label htmlFor="formQuestion" style={text}>
                  Question
                </label>
                <textarea
                  required
                  className="form-control"
                  id="formQuestion"
                  rows="2"
                  placeholder="Enter your question here"
                  onChange={(e) => {
                    handleQuestionChange(e.target.value);
                  }}
                ></textarea>
              </div>
              <div
                className="form-group"
                style={{ textAlign: "left", marginTop: 10 }}
              >
                <label htmlFor="form-topic" style={text}>
                  Topic
                </label>
                <select
                  required
                  className="form-select"
                  id="form-topic"
                  onChange={(e) => {
                    handleTopicChange(e.target.value);
                  }}
                >
                  <option value="">Choose a Topic</option>
                  <option value="1">Input Validation</option>
                  <option value="2">Encoding & Escaping</option>
                  <option value="3">Cross-Site Scripting</option>
                  <option value="4">SQL Injection</option>
                  <option value="5">Cryptography</option>
                  <option value="6">User Authentication</option>
                </select>
              </div>
              <div
                className="form-group"
                style={{ textAlign: "left", marginTop: 10 }}
              >
                <label htmlFor="form-type" style={text}>
                  Type
                </label>
                <select
                  className="form-select"
                  id="form-type"
                  required
                  onChange={(e) => {
                    handleTypeChange(e.target.value);
                  }}
                >
                  <option value="">Choose a Question Type</option>
                  <option value="1">Text Response</option>
                  <option value="2">True/False</option>
                  <option value="3">Multiple Choice</option>
                </select>
              </div>
              
              {newType === "3" && (
                <div
                  className="form-group"
                  style={{ textAlign: "left", marginTop: 10 }}
                >
                  <div className="container">
                    <label style={text}>Enter your options below</label>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ marginLeft: 10 }}
                      onClick={() => {
                        handleAddOption();
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="container">
                    {newOptions.map((option, index) => (
                      <div key={index} className="row row-cols-2">
                        <div className="col-11">
                          <textarea
                            required
                            className="form-control"
                            rows="1"
                            style={{ marginTop: 10 }}
                            value={option}
                            placeholder="Enter your option here"
                            onChange={(e) => {
                              handleOptionsChange(index, e.target.value);
                            }}
                          ></textarea>
                        </div>
                        {index >= 2 && (
                          <div className="col-1">
                            <button
                              required
                              type="button"
                              className="btn btn-danger btn-sm"
                              style={{ marginTop: 13 }}
                              onClick={() => {
                                handleRemoveOption(index);
                              }}
                            >
                              X
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div
                className="form-group"
                style={{ textAlign: "left", marginTop: 10 }}
              >
                <label htmlFor="form-answer" style={text}>
                  Answer
                </label>
                <textarea
                  className="form-control"
                  rows="1"
                  placeholder="Enter your solution to the question here"
                  required
                  onChange={(e) => {
                    handleAnswerChange(e.target.value);
                  }}
                ></textarea>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ marginTop: 20 }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
