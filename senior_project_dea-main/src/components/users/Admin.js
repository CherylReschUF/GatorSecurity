import React from 'react';
import Table from 'react-bootstrap/Table';
import GetConfig from '../../Config.js';
import {CSVLink} from "react-csv";

export default class Admin extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        allUsers: null
      };
    }
    componentDidMount(){
      //Function that pulls all user data from the backend
      fetch(GetConfig().SERVER_ADDRESS + "/users/allUsers", {
        method: "POST",
        crossDomain:true,
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({
        token:window.localStorage.getItem("token"),
      }),
      }).then((res)=>res.json())
      .then(data=>{
        //Set user retrieved to allUsers variable
        this.setState({allUsers: data});
      });

      //Function that pulls the total number of questions from the backend
      fetch(GetConfig().SERVER_ADDRESS + "/questions/getCount", {
        method: "POST",
        crossDomain:true,
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({displayType:'learn'}),
      }).then((res)=>res.json())
      .then(data=>{
        //Set the total number of learn questions to learnQuestionCount
        this.setState({learnQuestionCount: data.data})
      });

      //Function that pulls the total number of questions from the backend
      fetch(GetConfig().SERVER_ADDRESS + "/questions/getCount", {
        method: "POST",
        crossDomain:true,
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({displayType:'game'}),
      }).then((res)=>res.json())
      .then(data=>{
        //Set the total number of fill in the blank questions to gameQuestionCount
        this.setState({gameQuestionCount: data.data})
      });

      //Function that pulls the total number of games from the backend
      fetch(GetConfig().SERVER_ADDRESS + "/games/getCount", {
        method: "POST",
        crossDomain:true,
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({}),
      }).then((res)=>res.json())
      .then(data=>{
        //Set the total number of game questions (except for Fill in the Blank Questions) to allGamesCount
        this.setState({allGamesCount: data.data})
      });
    }

    render(){
      if(this.state.allUsers == null){
        return <div></div>
      }

      let learnMax = this.state.learnQuestionCount;
      let gameMax = this.state.allGamesCount + this.state.gameQuestionCount;

      //Function that calculates the total learn questions played/total learn questions
      function createLearnView(user){
        let learnScore = user["learnscore"].length;
        let totalScore = ["Total Score: " + learnScore + "/" + learnMax + "\n", "\n"]
        return <th style={{whiteSpace:"pre-wrap", wordWrap:"break-word"}}>{totalScore}</th>
      }

      //Function that calculates the total game questions played/total game questions
      function createGameView(user){
        let gameScore = user["gamescore"].length;
        let totalScore = ["Total Score: " + gameScore + "/" + gameMax + "\n", "\n"]
        return <th style={{whiteSpace:"pre-wrap", wordWrap:"break-word"}}>{totalScore}</th>
      }

      if(this.state.allUsers.status === 403) {
        return (<>You are not authorized to access this page.</>)
      }

      const headerCSV = [
          {label: "First Name", key: "firstName"},
          {label: "Last Name", key: "lastName"},
          {label: "Email", key: "email"},
          {label: "Learn Score", key: "learnScore"},
          {label: "Game Score", key: "gameScore"}
      ];

      let userCSV = [];
      this.state.allUsers.map((user) => (
          userCSV.push({firstName: user["fname"], lastName: user["lname"], email: user["email"], learnScore: user["learnscore"].length, gameScore: user["gamescore"].length})
      ));
      userCSV.push({});
      userCSV.push({email: "Total Questions", learnScore: `${learnMax}`, gameScore: `${gameMax}`});

      return (
          <div>
            {/* Download Student Progress Data Button */}
            <div style={{textAlign: "left"}}>
                <CSVLink className="btn btn-primary orange btn-lg" headers={headerCSV} data={userCSV} filename={"gatorsecurity-student-progress.csv"} target="_blank" style={{margin: 10}}>
                    Download Student Progress Data
                </CSVLink>
            </div>

            {/* Table that displays each individual user's data/scores */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Learn Sections</th>
                    <th>Game Sections</th>
                    </tr>
                </thead>
                <tbody>
                    {
                    this.state.allUsers.map((user, index) => (
                        <tr key={user["email"]}>
                            <td>{index}</td>
                            <td>{user["fname"]}</td>
                            <td>{user["lname"]}</td>
                            <td>{user["email"]}</td>
                            {createLearnView(user)}
                            {createGameView(user)}
                        </tr>
                    ))
                    }
                </tbody>
            </Table>
          </div>
      );
    }
    
}