import React from 'react';
import TradQuestion from './TraditionalQuestion'
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

const box = {
    boxShadow: "0 3px 10px rgba(0,0,0,.3)",
    padding: "30px 40px"
}

function NewGameTraditionalPage() {
    const [questionData1, setQuestionData1] = React.useState('');
    const [questionData2, setQuestionData2] = React.useState('');
    const [questionData3, setQuestionData3] = React.useState('');
    const [questionData4, setQuestionData4] = React.useState('');
    const [questionData5, setQuestionData5] = React.useState('');
  
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
          displayType: 'game'
        }),
        }).then((res)=>res.json())
        .then((data)=>{
          setQuestionData_(data);
        })
    }

    if(questionData1.length === 0) {
    getQuestions("3", setQuestionData1);
    }
    if(questionData2.length === 0) {
    getQuestions("7", setQuestionData2);
    }
    if(questionData3.length === 0) {
    getQuestions("8", setQuestionData3);
    }
    if(questionData4.length === 0) {
    getQuestions("1", setQuestionData4);
    }
    if(questionData5.length === 0) {
    getQuestions("5", setQuestionData5);
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
        <div id="gamepagediv">
            <h1 id="gametitle">Game</h1>
    
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row style={box}>
                <Col sm={3}>
                <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                    <Nav.Link eventKey="first">Q1: Cross-Site Scripting</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="second">Q2: URL SQL Injection</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="third">Q3: Login SQL Injection</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="fourth">Q4: Input Sanitization </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                    <Nav.Link eventKey="fifth">Q5: Cryptography</Nav.Link>
                    </Nav.Item>
                </Nav>
                </Col>
                <Col sm={9}>
                <Tab.Content>
                    <Tab.Pane eventKey="first">                   
                        {createQuestions(questionData1)}                   
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">                    
                        {createQuestions(questionData2)}         
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">                    
                        {createQuestions(questionData3)}                    
                    </Tab.Pane>
                    <Tab.Pane eventKey="fourth">                    
                        {createQuestions(questionData4)}                   
                    </Tab.Pane>
                    <Tab.Pane eventKey="fifth">                    
                        {createQuestions(questionData5)}                  
                    </Tab.Pane>
                </Tab.Content>
                </Col>
            </Row>
            </Tab.Container>
        </div>
        
      );
}

export default NewGameTraditionalPage;