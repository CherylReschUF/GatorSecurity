import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import TradQuestion from './TraditionalQuestion'

function LearnPage() {
  
  const container = {
    display: "block",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingTop: "50px"

  };

  const heading = {
    fontFamily: "Gluten",
    color: "#2613fe",
    fontSize: "40px",
    paddingBottom: "50px",
    textDecorationLine: "underline"

  };

  const tabs = {
    fontFamily: "Gluten",
    color: "#2613fe"

  };

  const tab = {

    padding: "30px",
    boxShadow: "0 3px 10px rgba(0,0,0,.3)",
    fontFamily: "Gluten",
    marginBottom: "80px"

  };

  const [questionData1, setQuestionData1] = React.useState('');
  const [questionData2, setQuestionData2] = React.useState('');
  const [questionData3, setQuestionData3] = React.useState('');
  const [questionData4, setQuestionData4] = React.useState('');
  const [questionData5, setQuestionData5] = React.useState('');
  const [questionData6, setQuestionData6] = React.useState('');

  const getQuestions = (topic_, setQuestionData_) => {
    fetch("http://localhost:5000/questions/get/" + topic_, {
      method: "POST",
      crossDomain:true,
      headers:{
          "Content-Type":"application/json",
          Accept:"application/json",
          "Access-Control-Allow-Origin":"*",
      },
      body:JSON.stringify({
        displayType: 'learn'
      }),
      }).then((res)=>res.json())
      .then((data)=>{
        setQuestionData_(data);
      })
  }
  if(questionData1.length === 0) {
    getQuestions("1", setQuestionData1);
  }
  if(questionData2.length === 0) {
    getQuestions("2", setQuestionData2);
  }
  if(questionData3.length === 0) {
    getQuestions("3", setQuestionData3);
  }
  if(questionData4.length === 0) {
    getQuestions("4", setQuestionData4);
  }
  if(questionData5.length === 0) {
    getQuestions("5", setQuestionData5);
  }
  if(questionData6.length === 0) {
    getQuestions("6", setQuestionData6);
  }

  const createQuestions = (data) => {
    if(data.length === 0) return (<></>);

    let questions = [];

    for(let i = 0; i < data.data.length; i++) {
      questions.push((
      <>
        <TradQuestion qdata={data.data[i]} num={i + 1} />
      </>
      ))
    }
  
    return questions;
  }

  return (
    <div id="learndiv" style={container}>
      <h4 style={heading}>Learn</h4>
      <Tabs fill justify defaultActiveKey="first" style={tabs}>
      <Tab eventKey="first" title="Input Validation" style={tab}>
          {createQuestions(questionData1)}
          Sourced from OWASP.
        </Tab>
        <Tab eventKey="second" title="Encoding & Escaping" style={tab}>
          {createQuestions(questionData2)}
          Sourced from OWASP.
        </Tab>
        <Tab eventKey="third" title="Cross-Site Scripting" style={tab}>
          {createQuestions(questionData3)}
          Sourced from CodePath, OWASP, and Veracode.
        </Tab>
        <Tab eventKey="fourth" title="SQL Injection" style={tab}>
          {createQuestions(questionData4)}
          Sourced from PortSwigger, CodePath, OWASP, and W3Schools.
        </Tab>
        <Tab eventKey="fifth" title="Cryptography" style={tab}>
          {createQuestions(questionData5)}
          Sourced from CodePath and GeeksForGeeks.
        </Tab>
        <Tab eventKey="sixth" title="User Authentication" style={tab}>
          {createQuestions(questionData6)}
          Sourced from CodePath and TechTarget.
        </Tab>
      </Tabs>
    </div>
  );
}

export default LearnPage;