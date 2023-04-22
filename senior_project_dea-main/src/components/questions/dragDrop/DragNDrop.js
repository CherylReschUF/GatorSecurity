import React, { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import arrayShuffle from "array-shuffle";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useSortable, arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import GetConfig from '../../../Config.js';

function DragNDrop() {

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameQuestionData, setGameQuestionData] = React.useState('');
  const [DNDQuestionData, setDNDQuestionData] = React.useState('');
  const [dndOptions, setDndOptions] = React.useState([]);

  //Loads the data from database once
  React.useEffect(()=> {

    const loadGame = async () => {
        
      //If gameQuestionData not loaded yet, get it from the DB
      if(gameQuestionData.length === 0) {
        const ind = window.location.href.lastIndexOf('/');
        getGameQuestion(window.location.href.substring(ind + 1), setGameQuestionData);
      }

      //If gameQuestionData has been loaded
      if(gameQuestionData.length !== 0) {
        //If CYOAQuestionData has not been loaded, get it from the DB
        if(DNDQuestionData.length === 0) {
          getDNDQuestion(gameQuestionData.questionData[currentQuestion], setDNDQuestionData);
        }
      }

      //If DNDQuestionData has been loaded
      if(DNDQuestionData.length !== 0) {
        //If dndOptions state has not been set
        if(dndOptions.length === 0) {
          //Shuffle the array's correct order
          setDndOptions(arrayShuffle(DNDQuestionData.answer));
        }
      }
    }
    //Initial function call to load data
    loadGame();
    
  },[gameQuestionData, DNDQuestionData, currentQuestion, dndOptions])

  //Function that pulls gameQuestion data from backend
  const getGameQuestion = (id_, setGameQuestionData_) => {
    fetch(GetConfig().SERVER_ADDRESS + "/games/getById/" + id_, {
      method: "POST",
      crossDomain:true,
      headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({}),
      }).then((res) => res.json())
      .then((data)=>{
        //Set the gameQuestionData's state to the data received from the backend (data.data)
        setGameQuestionData_(data.data);
    })
  }

  //Function that pulls DnD Question data from backend
  const getDNDQuestion = (questionNumber_, setDNDQuestionData_) => {
    fetch(GetConfig().SERVER_ADDRESS + "/games/dnd/getById/" + questionNumber_, {
      method: "POST",
      crossDomain:true,
      headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({}),
      }).then((res) => res.json())
      .then((data)=>{
        //Set the DNDQuestionData's state to the data received from the backend (data.data)
        setDNDQuestionData_(data.data);
        
        //If dndOptions has been loaded
        if (dndOptions.length !== 0) {
          //Set the dndOptions's state to the shuffled answers from the backend
          setDndOptions(arrayShuffle(data.data.answer));
        }
    })
  }

  //Function that handles the logic for a dragged object when it is dropped
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setDndOptions((items) => {
        const activeIndex = items.indexOf(active.id);
        const overIndex = items.indexOf(over.id);
        return arrayMove(items, activeIndex, overIndex);
        // items: [2, 3, 1]   0  -> 2
        // [1, 2, 3] oldIndex: 0 newIndex: 2  -> [2, 3, 1]
      });
    }
  }

  //Function that checks answer and updates the user's score when game ends
  async function checkAnswer() {

    //Checks answers
    for (let i = 0; i < DNDQuestionData.answer.length; i++) {
      if(dndOptions[i] !== DNDQuestionData.answer[i]) {
        alert("Keep trying!");
        return;
      }
    }

    //If this is the end of the game
    if (currentQuestion + 1 >= gameQuestionData.questionData.length) {
      //Update the user's score via HTTP request
      fetch(GetConfig().SERVER_ADDRESS + "/users/updateScore", {
        method: "POST",
        crossDomain:true,
        headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
        },
        body:JSON.stringify({
            token:window.localStorage.getItem("token"),
            qid: gameQuestionData._id, 
        }),
      }).then((res) => {
        //If request was a success
        if(res.status === 204) {
          //If there is no explanation
          if (DNDQuestionData.explanation === "" || DNDQuestionData.explanation === undefined) {
            alert("Congratulations! You beat the game!");
          }
          //Else there is an explanation
          else {
            //Congratulate the user and return to /game page
            alert("Congratulations! You beat the game!\n\nAnswer explanation: " + DNDQuestionData.explanation);
          }
          //Relocate the user to the games page
          window.location.href="/game";
        }
        else {
          alert("Something went wrong with the backend!");
        }
    })}
    //Else there are more questions
    else {
      //Increase the value of currentQuestion by 1
      setCurrentQuestion(currentQuestion => currentQuestion + 1);
      //If there is no explanation
      if (DNDQuestionData.explanation === "") {
        alert("Correct!");
      }
      //Else there is an explanation
      else {
        //Give correct alert to end-user, and update page to next question
        alert("Correct!\n\nAnswer explanation: " + DNDQuestionData.explanation);
      }
      //Load the next DND question from the backend and set it to the DNDQuestionData variable
      getDNDQuestion(gameQuestionData.questionData[currentQuestion + 1], setDNDQuestionData);
    }
  }

  //If DNDQuestionData hasn't been loaded yet
  if(dndOptions.length === 0) {
      //Display loading page
      return <div>Loading...</div>;
  }
  else {
    //Return what will be rendered to the user's page
    return (
      <div className="Container">
        <div
          className="row col-lg-auto"
          style={{ justifyContent: "center", marginTop: 35 }}
        >
          <div className="col-12 col-md-5" style={{width: "35%", marginTop: "auto", marginBottom: "auto"}}>
                      <img
                      src={GetConfig().SERVER_ADDRESS + `/uploads/dnd/${DNDQuestionData.stimulus}`}
                      alt="..."
                      style={{ height: "auto", width: "100%", borderColor: "#2C74B3", borderStyle: "solid", borderWidth: "1px" }}
                    />
          </div>
  
          <div className="col-12 col-md-5">
            <p className=" px-3 px-md-0" style={{ marginTop: 20, textAlign: "center"}}>
              {DNDQuestionData.question}
            </p>
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <Container
                className="col-10 col-md-10 col-lg-8"
                style={{ marginTop: 50 }}
                align="center"
              >
                <SortableContext
                  items={dndOptions}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="card body">
                    {dndOptions.map((item) => (
                      <SortableItem key={item} id={item} />
                    ))}
                  </div>
                </SortableContext>
              </Container>
            </DndContext>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ marginTop: 20, width: 125 }}
              onClick={() => {
                checkAnswer();
              }}
            >
            Check
            </button>
          </div>
        </div>
      </div>
    );
  }
}

//This component returns the objects within the drag and drop list
function SortableItem(props) {
  const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition
  } = useSortable({id: props.id});

  const style = {
      transform: CSS.Transform.toString(transform),
      transition
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div className="card m-3">
            <div className="card-body">
            {props.id}
            </div>
        </div>
    </div>
  )
}

export default DragNDrop;