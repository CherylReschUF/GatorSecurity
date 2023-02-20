import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import QuestionEdit from "./QuestionEdit";

const text = {
  fontFamily: "Gluten",
  color: "#2613fe",
};

const text_blk = {
  fontFamily: "Gluten",
  color: "#000000",
};

export default function QuestionCard({
  question_Card,
  topic_Card,
  type_Card,
  options_Card,
  answer_Card,
  id_Card,
  displayType_Card,
}) {
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);

  return (
    <div className="container">
      <div className="card" style={{ marginBottom: 25 }}>
        <div className="card-body" style={{ textAlign: "left" }}>
          <div className="container">
            <div className="row my-3">
              <div className="col">
                <p style={text}>Topic: {topic_Card}</p>
              </div>
              <div className="col">
                <p style={text}>Display Type: {displayType_Card}</p>
              </div>
              <div className="col" style={{ textAlign: "right" }}>
                <button
                  type="btn"
                  className="btn btn-primary btn-sm mx-1"
                  onClick={() => setEditModalShow(true)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-sm mx-1"
                  onClick={() => setDeleteModalShow(true)}
                >
                  X
                </button>
              </div>
            </div>
            <div className="row">
              <p style={text_blk}>{question_Card}</p>
            </div>
            <div className="row">
              <p style={text}>Options:</p>
            </div>
            <div className="col">
              <ul style={{ listStyleType: "none" }}>
                {options_Card.map((opt, index) => {
                  return (
                    <li key={index} style={text_blk}>
                      {opt}{" "}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="row">
              <div className="col">
                <p style={text}>
                  Answer: <span style={text_blk}>{answer_Card}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        id_delete={id_Card}
      />
      <EditModal
        show={editModalShow}
        question_editmodal={question_Card}
        topic_editmodal={topic_Card}
        type_editmodal={type_Card}
        options_editmodal={options_Card}
        answer_editmodal={answer_Card}
        id_editmodal={id_Card}
        displayType_editmodal={displayType_Card}
        onHide={() => setEditModalShow(false)}
      />
    </div>
  );
}

function DeleteModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Are you sure?</h5>
        <p>
          Deleting this question will remove it completely from the database.
          Once gone it will not be recoverable.
        </p>
        <p>Would you like to continue?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          className="btn btn-success float-left"
          onClick={props.onHide}
        >
          Save
        </Button>
        <Button
          type="Submit"
          className="btn btn-danger"
          onClick={() => {
            DeleteQuestion(props.id_delete);
            window.location.reload();
          }}
        >
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function EditModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Edit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <QuestionEdit
          editQuestion={props.question_editmodal}
          editTopic={props.topic_editmodal}
          editType={props.type_editmodal}
          editOptions={props.options_editmodal}
          editAnswer={props.answer_editmodal}
          editID={props.id_editmodal}
          editDisplayType={props.displayType_editmodal}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          className="btn btn-secondary float-left"
          onClick={props.onHide}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const DeleteQuestion = (removeID) => {
  fetch(`http://localhost:5000/questions/delete/${removeID}`, {
    method: "DELETE",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "http://localhost:3000/",
    },
    body: JSON.stringify({
      token: window.localStorage.getItem("token"),
    }),
  }).then(() => {
    alert("Question was successfully deleted.");
  });
};
