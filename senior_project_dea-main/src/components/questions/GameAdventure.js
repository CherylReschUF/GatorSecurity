import React from 'react';
import GetConfig from '../../Config.js';
import 'bootstrap/dist/css/bootstrap.css';
import '../componentStyling/buttons.css';

function GameAdventurePage() {

    const [count, setCounter] = React.useState(0);
    const [gameQuestionData, setGameQuestionData] = React.useState('');
    const [CYOAQuestionData, setCYOAQuestionData] = React.useState('');

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
                if(CYOAQuestionData.length === 0) {
                    getCYOAQuestion(gameQuestionData.questionData[count], setCYOAQuestionData);
                }
            }
        }

        //Initial function call to load data
        loadGame();
    },[gameQuestionData, CYOAQuestionData, count])
    
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
            setGameQuestionData_(data.data);
        })
    }

    //Function that pulls CYOAQuestion data from backend
    const getCYOAQuestion = (questionNumber_, setCYOAQuestionData_) => {

        fetch(GetConfig().SERVER_ADDRESS + "/games/cyoa/getById/" + questionNumber_, {
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
            setCYOAQuestionData_(data.data);
        })
    }

    //Function to update counter value
    const increase = () => {
        setCounter(count => count + 1)
    }

    //Function to check if user has submitted correct answer or not
    const submit = (index) => {
        //If option matches answer
        if (CYOAQuestionData.options[index] === CYOAQuestionData.answer) {
            //If this is not the last question
            if (gameQuestionData.questionData.length !== count + 1) {
                if (CYOAQuestionData.explanation === "") {
                    alert("Correct!");
                }
                else {
                    //Give correct alert to end-user, and update page to next question
                    alert("Correct!\n\nAnswer explanation: " + CYOAQuestionData.explanation);
                }
                increase();
                getCYOAQuestion(gameQuestionData.questionData[count + 1], setCYOAQuestionData);
            }
            //Else this is the last question
            else {
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
                    if(res.status === 204) {
                        if (CYOAQuestionData.explanation === "") {
                            alert("Congratulations! You beat the game!");
                        }
                        else {
                            //Congratulate end-user, and redirect them to game selection page
                            alert("Congratulations! You beat the game!\n\nAnswer explanation: " + CYOAQuestionData.explanation);
                        }
                        window.location.href="/game"
                    }
                    else {
                        alert("Something went wrong with the backend!");
                    }
                })
            } 
        }
        //Else option does not match, alert end-user incorrect
        else {
            alert("Incorrect!");
        }
    }

    const spaceAfterQ = {
        paddingTop: "15px"
    }

    const textCenter = {
        marginLeft: "25%",
        width: "50%"
    }

    const topBtmPadding = {
        paddingTop: "40px",
        paddingBottom: "40px"
    }

    const imageContainerSize = {
        height: "60%",
        margin: "auto"
    }

    const imageStyling = {
        width: "auto",
        height: "100%",
        borderColor: "#2C74B3",
        borderStyle: "solid",
        borderWidth: "1px"
    }
    
    const buttonWidth = {
        width: "40%",
        margin: "auto"
    }

    //If CYOAQuestionData hasn't been loaded yet
    if(CYOAQuestionData.length === 0) {
        //Display loading page
        return <div>Loading...</div>;
    }
    else {
        //HTML elements that will be rendered to page
        return (
            <div style={topBtmPadding}>
                <div style={spaceAfterQ}></div>
                {/* Dynamically loaded CYOA question image */}
                <div style={imageContainerSize}>
                    <img src={GetConfig().SERVER_ADDRESS + `/uploads/cyoa/${CYOAQuestionData.stimulus}`} className='img-fluid' alt='...' style={imageStyling} />
                </div>
                <div style={spaceAfterQ}></div>
                <div style={textCenter}>{CYOAQuestionData.questionNumber}. {CYOAQuestionData.question}</div>
                <div style={spaceAfterQ}></div>
                {/* btn-block - List of buttons to represent options */}
                <div className="btn-block img-fluid shadow-4 d-grid gap-2 col-6 mx-auto justify-content-center" style={buttonWidth}>
                {/* A loop that dynamically populates buttons with the current CYOAQuestionData options */}
                <div style={{borderColor: "#2C74B3", borderStyle: "solid", borderSize: "10px", padding:"20px", borderRadius: "25px"}}>
                    {CYOAQuestionData.options.map((option, index) => (
                        <div key={option}>
                            <button onClick={() => {submit(index)}} type="button" className="btn btn-primary btn-lg btn-block" >{option}</button>
                            <div style={spaceAfterQ}></div>
                        </div>
                    ))}
                </div>
                </div>
            </div>
        );
    }
}

export default GameAdventurePage;