import React, { Component } from 'react'
import LoginBanner from './LoginBanner';
import './LoginAndSignUp.css';
import gator from '../images/gator.png';

export default class Login extends Component {
    constructor(props){
        super(props)
        this.state={
            email:"",
            password:""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    };
    handleSubmit(e){
        e.preventDefault();
        const{email, password} = this.state;
        console.log(email, password);

        fetch("http://localhost:5000/login", {
      method: "POST",
      crossDomain:true,
      headers:{
        "Content-Type":"application/json",
        Accept:"application/json",
      },
      body:JSON.stringify({
        email,
        password
      }),
    }).then((res)=>res.json())
    .then((data)=>{
      console.log(data,"userRegister");
      if(data.status=="ok"){
        alert("Login was successful");
        window.localStorage.setItem("token", data.data);
        window.location.href="./welcome"
      }
    });
    }
  render() {
    return (
      
      <div>
        <LoginBanner/>
        <div className='bannerSpacer'></div>
        <img className="gator-image" src={gator}  />
        <form onSubmit={this.handleSubmit}>
          <h3 className='title-name'>Sign In</h3>

          <div className="mb-3">
            <label>Email </label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email..."
              onChange={e=>this.setState({email:e.target.value})}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password..."
              onChange={e=>this.setState({password:e.target.value})}
            />
          </div>

          

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
          <p className="forgot-password text-right">
            Not registered? <a href="/sign-up">Sign up!</a>
          </p>
        </form>
      </div>
    )
  }
}