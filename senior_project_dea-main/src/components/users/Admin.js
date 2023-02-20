import React from 'react';
import Table from 'react-bootstrap/Table';

export default class Admin extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        allUsers: null
      };
    }
    componentDidMount(){
      fetch("http://localhost:5000/users/allUsers", 
        {
          method: "POST",
          crossDomain:true,
          headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({
          token:window.localStorage.getItem("token"),
        }),
        }).then((res)=>res.json())
        .then(data=>{
            console.log("data: ")
            console.log(data)
          this.setState({allUsers: data});
        });
    }
    render(){
        console.log("all users:")
        console.log(this.state.allUsers);
      if(this.state.allUsers == null){
        return <div></div>
      }
      function createLearnView(user){
        var learnScore = user["learnscore"].reduce((a, b) => a + b, 0);
        var learnMax = user["learnscore"].length;
        var totalScore = ["Total Score: "+learnScore+"/"+learnMax+"\n","\n"]
        var learnView = []
        for(var i=0; i<user["learnscore"].length; i++){
            var message = "Incomplete"
            var textColor = "red"
            if(user["learnscore"][i] === 1){
                message = "Complete   "
                textColor = "limegreen"
            }
            var element = <div style={{color: textColor}}>{(i+1)+": "+message+"\n"}</div>
            learnView.push(element)
        }
        return <th style={{whiteSpace:"pre-wrap", wordWrap:"break-word"}}>{totalScore}{learnView}</th>
      }
      function createGameView(user){
        var gameScore = user["gamescore"].reduce((a, b) => a + b, 0);
        var gameMax = user["gamescore"].length;
        var totalScore = ["Total Score: "+gameScore+"/"+gameMax+"\n","\n"]
        var gameView = []
        for(var i=0; i<user["gamescore"].length; i++){
            var message = "Incomplete"
            var textColor = "red"
            if(user["gamescore"][i] === 1){
                message = "Complete   "
                textColor = "limegreen"
            }
            var element = <div style={{color: textColor}}>{(i+1)+": "+message+"\n"}</div>
            gameView.push(element)
        }
        return <th style={{whiteSpace:"pre-wrap", wordWrap:"break-word"}}>{totalScore}{gameView}</th>
      }

      if(this.state.allUsers.status === 403) {
        return (<>You are not authorized to access this page.</>)
      }

      return (
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
                    <tr>
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

      );
    }
    
}