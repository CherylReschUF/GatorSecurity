import React, { Component } from 'react'
import LoginBanner from './LoginBanner';
import gator from '../../images/gator.png';
import GetConfig from '../../Config.js';
import './css/LoginAndSignUp.css';

export default class SignUp extends Component {
  constructor(props){
    super (props)
    this.state={
      fname:"",
      lname:"",
      email:"",
      password:""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //Function that handles the user submitted signup data
  handleSubmit(e){
    //Needed for Mozilla Firefox. Without it, forms won't be properly submitted to the backend.
    e.preventDefault();

    const{fname, lname, email, password} = this.state;

    //Function that registers the user in the backend
    fetch(GetConfig().SERVER_ADDRESS + "/users/register", {
      method: "POST",
      crossDomain:true,
      headers:{
        "Content-Type":"application/json",
        Accept:"application/json",
        "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
      },
      body:JSON.stringify({
        fname,
        lname,
        email,
        password
      }),
    }).then((res)=>res.json())
    .then((data)=>{
      if(data.status==="ok"){
        alert("Registration was successful");
        window.location.href="./sign-in"
      }
    })
  }

  render() {
    return (
      <div>
        <LoginBanner/>
        <br/>
        <img className="gator-image" src={gator} alt="Gator"/>
        <form onSubmit={this.handleSubmit}>
          <h3 className='title-name'>Sign Up</h3>

          {/*First Name Input*/}
          <div className="mb-3">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter first name..."
              onChange={e=>this.setState({fname:e.target.value})}
            />
          </div>

          {/*Last Name Input*/}
          <div className="mb-3">
            <label>Last name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Enter last name..." 
              onChange={e=>this.setState({lname:e.target.value})}
            />
          </div>

          {/*Email Input*/}
          <div className="mb-3">
            <label>Email </label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email..."
              onChange={e=>this.setState({email:e.target.value})}
            />
          </div>

          {/*Password Input*/}
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password..."
              onChange={e=>this.setState({password:e.target.value})}
            />
          </div>

          {/*Submit Button*/}
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          
          {/* This is the login redirect text */}
          <p className="forgot-password text-right">
            Already registered? <a href="/sign-in">Sign in!</a>
          </p>
        </form>
      </div>
    )
  }
}