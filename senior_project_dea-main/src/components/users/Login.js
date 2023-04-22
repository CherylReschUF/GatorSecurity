import React, { Component } from "react";
import "./css/LoginAndSignUp.css";
import gator from "../../images/gator.png";
import GetConfig from '../../Config.js';

export default class Login extends Component {
    constructor(props){
        super(props)
        this.state={
            email:"",
            password:""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    //Function that handles the user submitted login data
    handleSubmit(e){
      //Needed for Mozilla Firefox. Without it, forms won't be properly submitted to the backend.
      e.preventDefault();

      const{email, password} = this.state;

      //Function that checks user's login information in the backend
      fetch(GetConfig().SERVER_ADDRESS + "/users/login", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin":GetConfig().SERVER_ADDRESS,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }).then((res)=>res.json())
      .then((data)=>{
        //If the user provided valid credentials, give them a normal user browser cookie, and redirect them to /welcome
        if(data.status === "ok") {
          alert("Login was successful!");
          window.localStorage.removeItem("token");
          window.localStorage.setItem("token", data.data);
          window.location.href="./welcome"
        }
        //Else the user provided invalid credentials
        else {
          alert("Login was unsuccessful. Please try again.");
        }
      });
  }
  render() {
    return (
      <div
        style={{
          backgroundImage: "linear-gradient(#0A2647, #2C74B3)",
          height: "100vh",
        }}
      >
        <div className="container">
          <div className="row" style={{justifyContent: "center"}}>

          <div className="card col-10 col-md-6"  style={{marginTop: "100px", backgroundColor:"rgba(255,255,255, 0.80)"}}>
            <div className="card-body"  style={{marginTop: "30px"}}>
              {/* This is Gator image */}
              <img
                className="gator-image"
                src={gator}
                alt="Gator"
                height={"100px"}
              />

              <form onSubmit={this.handleSubmit}>
                <h3 className="title-name">Sign In</h3>

                {/* This is the email input box */}
                <div className="mb-3" style={{ textAlign: "left", minWidth:200 }}>
                  <label style={{ paddingLeft: 10 }}>Email </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email..."
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>

                {/* This is the password input box */}
                <div className="mb-3" style={{ textAlign: "left", minWidth:200 }}>
                  <label style={{ paddingLeft: 10 }}>Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password..."
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </div>

                {/* This is the Login button */}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>

                {/* This is the signup redirect text */}
                <p className="forgot-password text-right">
                  Not registered? <a href="/sign-up">Sign up!</a>
                </p>
              </form>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
