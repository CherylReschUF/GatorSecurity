import React, {useEffect, useState, useCallback} from "react";
import MatchingCard from "./MatchingCard";
import arrayShuffle from "array-shuffle";
import GetConfig from '../../../Config';

function Matching () {
    const [gameQuestionData, setGameQuestionData] = React.useState('');
    const [MatchingQuestionData, setMatchingQuestionData] = React.useState('');
    const [vocab, setVocab] = useState([]);

    // Loads data from database once
    React.useEffect(() => {

        const loadGame = async () => {
            //If gameQuestionData not loaded yet, get it from the DB
            if(gameQuestionData.length === 0) {
                const ind = window.location.href.lastIndexOf('/');
                getGameQuestion(window.location.href.substring(ind + 1), setGameQuestionData);
            }
            
            //If gameQuestionData has been loaded
            if(gameQuestionData.length !== 0) {
                //If MatchingQuestionData has not been loaded, get it from the DB
                if(MatchingQuestionData.length === 0) {
                    getMatchingQuestion(gameQuestionData.questionData[0], setMatchingQuestionData);
                }
            }

            //If MatchingQuestionData has been loaded
            if(MatchingQuestionData.length !== 0) {
                //If matchingOptions state has not been set
                if(vocab.length === 0) {
                    //Shuffle the array's correct order
                    prepareMap(MatchingQuestionData.content, setVocab);
                }
            }
        }

        //Initial funstion call to load game
        loadGame();
    },[gameQuestionData, MatchingQuestionData, vocab])

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

    //Function that pulls Matching Question data from backend
    const getMatchingQuestion = (questionNumber_, setMatchingQuestionData_) => {
        fetch(GetConfig().SERVER_ADDRESS + "/games/matching/getById/" + questionNumber_, {
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
                setMatchingQuestionData_(data.data);
        })
    }

    const prepareMap = (map, setter) => {
        let array = [];

        for(let key of Object.keys(map)) {
            array.push([key, map[key]]);
        }
        
        setter(array);
    }

    //cards hold the current cards being used in the game
    const [cards, setCards] = useState([]);
    //choiceOne will hold the card object for the players first choice
    const [choiceOne, setChoiceOne] = useState(null);
    //choiceTwo will hold the card object for the players second choice
    const [choiceTwo, setChoiceTwo] = useState(null);
    //diabled will allow for the selection of cards to be disabled when the players selections are being compared
    const [disabled, setDisabled] = useState(false);
    //numberCorrect will track how many times the user correctly answers cards
    const [numCorrect, setNumCorrect] = useState(0);

    //set the choices equal to the card object the user chooses depending on which choice it is
    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    }

    //starts a new game; used with "new game" button
    const newGame = () => {
        resetChoices();
        generateCards();
        setNumCorrect(0);
    }

    //this function generates a randomized subset of cardss based on the input vocab set
    const generateCards = useCallback(() => {
        //removed previous cards
        setCards([]);
        const tempCards = [];
        //generates randomized subset
        const cardSubset = arrayShuffle(vocab).slice(0,vocab[0].length / 2);
        //splits definitions from keywords
        cardSubset.map((each, index) => {
            const temp1 = {
                val: index,
                text: each.at(0),
                matched: false
            }
            const temp2 = {
                val: index,
                text: each.at(1),
                matched: false
            }
            tempCards.push(temp1);
            tempCards.push(temp2);
            return tempCards;
        })
        //randomizes the cards
        const temp = arrayShuffle(tempCards);
        setCards(temp);
    },[vocab])

    //resets choice states after two cards have been chosen and evaluated
    const resetChoices = () => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setDisabled(false);
    }

    //generates cards when the vocab array is changed (unused now, but will be used when connected to database)
    useEffect(() => {
        if(vocab === '' || vocab.length !== 0) {
            generateCards();
        }
    },[generateCards, vocab]);

    //congratulates player after completing game
    useEffect(() => {
        if(vocab === '' || vocab.length !== 0) {
            //if number of correct matches equals total number of pairs (keywords and definitions)
            if(numCorrect === vocab[0].length / 2) {
                //Update the user's score via HTTP request
            fetch(GetConfig().SERVER_ADDRESS + "/users/updateScore", {
              method: "POST",
              crossDomain:true,
              headers:{
                "Content-Type":"application/json",
                Accept:"application/json",
                "Access-Control-Allow-Origin": GetConfig().SERVER_ADDRESS,
            },
            body:JSON.stringify({
                token:window.localStorage.getItem("token"),
                qid: gameQuestionData._id, 
            }),
            }).then((res) => {
            //If request was a success
            if(res.status === 204) {
                alert("Congratulations! You beat the game!");
            }
            else {
                alert("Something went wrong with the backend!");
            }
            })}
        }
    }, [gameQuestionData._id, numCorrect, vocab, vocab.length]);

    //evaluates the players choices once two cards have been chosen
    useEffect(() => {
        if(choiceOne && choiceTwo){

            setDisabled(true);
            
            if(choiceOne.val === choiceTwo.val){
                resetChoices();
                const temp = cards.map(card => {
                    if(card.val === choiceOne.val){
                        return {...card, matched: true};
                    }
                    else{
                        return card;
                    }
                })
                setCards(temp);
                setNumCorrect(numCorrect + 1);
            }
            else{
                //when the player is incorrect, the game will wait 1.5 seconds before flipping cards back over
                setTimeout(() => resetChoices(), 1500);
            }
        }
    }, [cards, choiceOne, choiceTwo, numCorrect]);

    if(vocab.length === 0) {
        //Display loading page
        return <div>Loading...</div>;
    }
    else {
        return(
            <div className="container">
                <div className="row" style={{marginTop:50, justifyContent:"center"}}>
                    <h1 style={{color: "#113F67"}}>Memory Matching</h1>
                    <button className="btn btn-primary" style={{maxWidth: 150, marginTop: 25}} onClick={newGame}>New Game</button>
                </div>
                <div className="row" style={{marginTop: 50}}>
                {cards.map((card, index) => (
                    <div key={index} className="col-3" style={{display: "flex", justifyContent:"center"}}>
                    <MatchingCard
                        card={card}
                        handleChoice={handleChoice}
                        flipped={card === choiceOne || card === choiceTwo || card.matched}
                        disabled={disabled}
                    />
                    </div>
                ))}
                </div>
            </div>
        );
    }
}

export default Matching;
