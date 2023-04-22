import React from 'react';
import GetConfig from '../Config.js';
import Carousel from 'react-bootstrap/Carousel'

import './componentStyling/textStyling.css'

export default class WelcomePage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      userInfo: null
    };
  }

  componentDidMount(){
    //Function that pulls the current user's profile info from the backend
    fetch(GetConfig().SERVER_ADDRESS + "/users/userInfo", {
        method: "POST",
        crossDomain:true,
        headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({
        //User is identified by their cookie assigned at login
        token:window.localStorage.getItem("token"),
      }),
      }).then((res)=>res.json())
      .then(data=>{
        //Set the state of userInfo to info of user retrieved from database
        this.setState({userInfo: data.data});
    });
  }

  render(){
    const carousel = {    
        position: "absolute",
        top: "calc(55% + 40px)",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "30%",
        height: "500px"
    }

    const title = {
        fontFamily:"Gluten",        
        color:"white",
        marginBottom:"2%"
    }

    const caption = {
        fontFamily:"Gluten",
        color:"white",
        marginLeft:"7.5%",
        marginRight:"7.5%"
    }

    const image = {
        height:"8rem",
        marginTop:"7.5%"
    }

    if(this.state.userInfo == null) {
      return <div></div>
    }
    
    let name = this.state.userInfo["fname"];

  return (
    <Carousel style={carousel} interval={8000}>
      <Carousel.Item>
        <div className='w-100 d-block' style={{backgroundColor:"#E7933A", height: "20rem"}}>
          <img src='./welcomeImg.png' style={image} alt="Stick Figure Waving"></img>
          <h5 style={title}>Welcome {name}!</h5>
          <p style={caption}>Please navigate to the "Learn" page to read up on important topics, and then head over to the "Game" page to test your knowledge.</p>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='w-100 d-block' style={{backgroundColor:"#2613D8", height: "20rem"}}>
          <img src='./scoreImg.png' style={image} alt="Ascending Steps with Flag on Last Step"></img>
          <h5 style={title}>Checking Your Score</h5>
          <p style={caption}>Take a look at your "My Profile" page to see your progress. There you can see how many sections and game questions you have completed. Keep up the great work!</p>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='w-100 d-block' style={{backgroundColor:"#E7933A", height: "20rem"}}>
          <img src='./creatorImg.png' style={image} alt="Lightbulb"></img>
          <h5 style={title}>The Creators</h5>
          <p style={caption}>This website was created by University of Florida students Daymao Silva, Erick Gonzalez, and Annalina Becker for their Fall 2022 senior project. They were advised under Professor Cheryl Resch.</p>
        </div>
      </Carousel.Item>
      <Carousel.Item>
        <div className='w-100 d-block' style={{backgroundColor:"#2613D8", height: "20rem"}}>
          <img src='./creatorImg.png' style={image} alt="Lightbulb"></img>
          <h5 style={title}>The Creators</h5>
          <p style={caption}>Development of this website was continued in Spring 2023 by University of Florida seniors Jacob Boney, Kerry Hannigan, Brian Hoblin, Dylan Tosh, and Connor Wojtak under Professor Cheryl Resch.</p>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}}