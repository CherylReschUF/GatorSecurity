import { useState } from "react";

export default function QuestionEdit(props) {
  const [editQuestion, setEditQuestion] = useState(props.editQuestion);
  const [editTopic, setEditTopic] = useState(props.editTopic);
  const [editType, setEditType] = useState(props.editType);
  const [editOptions, setEditOptions] = useState(props.editOptions);
  const [editAnswer, setEditAnswer] = useState(props.editAnswer);
  const [editDisplayType, setEditDisplayType] = useState(props.editDisplayType);

  const handleQuestionChange = (value) => {
    setEditQuestion(value);
  };

  const handleTopicChange = (value) => {
    setEditTopic(value);
  };

  const handleDisplayTypeChange = (value) => {
    setEditDisplayType(value);
  }

  const handleTypeChange = (value) => {
    if (value === "1") {
      let array = [""];
      setEditOptions(array);
    } else if (value === "2") {
      let array = ["True", "False"];
      setEditOptions(array);
    } else {
      let array = ["", ""];
      setEditOptions(array);
    }

    setEditType(value);
  };

  const handleOptionsChange = (index, value) => {
    let tempOptions = [...editOptions];
    tempOptions[index] = value;
    setEditOptions(tempOptions);
  };

  const handleAnswerChange = (value) => {
    setEditAnswer(value);
  };

  const handleAddOption = () => {
    setEditOptions((options) => [...options, ""]);
  };

  const handleRemoveOption = (value) => {
    let filter = editOptions.filter((option, index) => index !== value);
    setEditOptions(filter);
  };

  const handleUpdate = () => {
    fetch(`http://localhost:5000/questions/update/${props.editID}`, {
      method: "PUT",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000/",
      },
      body: JSON.stringify({
        question: editQuestion,
        type: editType,
        topic: editTopic,
        options: editOptions,
        answer: editAnswer,
        displayType: editDisplayType,
        token: window.localStorage.getItem("token"),
      }),
    }).then(() => {
      alert("Question has been updated successfully.");
    });
  };

  const text = {
    fontFamily: "Gluten",
    color: "#2613fe",
  };

  return (
    <div className="card">
      <div className="card-body">
        <form onSubmit={handleUpdate}>
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
              value={editQuestion}
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
              Display Type
            </label>
            <select
              required
              className="form-select"
              id="form-topic"
              value={editDisplayType}
              onChange={(e) => {
                handleDisplayTypeChange(e.target.value);
              }}
            >
              <option value="learn">Learn Page</option>
              <option value="game">Game Page</option>
            </select>
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
              value={editTopic}
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
              <option value="7">URL SQL Injection</option>
              <option value="8">Login SQL Injection</option>
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
              value={editType}
              onChange={(e) => {
                handleTypeChange(e.target.value);
              }}
            >
              <option value="">Choose Question Type</option>
              <option value="1">Text Response</option>
              <option value="2">True/False</option>
              <option value="3">Multiple Choice</option>
            </select>
          </div>
          {String(editType) === "3" && (
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
                {editOptions.map((option, index) => (
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
              value={editAnswer}
              required
              onChange={(e) => {
                handleAnswerChange(e.target.value);
              }}
            ></textarea>
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ marginTop: 20 }}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
