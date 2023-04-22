import React, {Component} from "react";
import GetConfig from '../../Config.js';
import './css/LoginAndSignUp.css';

export default class UserInfo extends Component{

    constructor(props){
        super(props);
        this.state = {
            userInfo: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
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
        .then((data)=>{
            //Set the state of userInfo to info of user retrieved from database
            this.setState({userInfo: data.data.dbUserData});
        })
    }

    //Defines what happens when you click the Submit button
    handleSubmit(e){
        //Catches errors with form before submitting
        e.preventDefault();
        
        const confirm = window.confirm("Are you sure you want to make these changes? You will be logged out upon saving.")

        if (confirm) {
            //Defines the current user _id
            const _id = this.state.userInfo._id;

            const{fname, lname, email, password} = this.state;

            //Function that updates the user's profile information
            fetch(`${GetConfig().SERVER_ADDRESS}/users/update/${_id}`, {
                method: "PUT",
                crossDomain: true,
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
            }).then((res)=>{
                //If a good response
                if (res.ok) {
                    //Send a popup stating successful edit, delete user's token, then redirect page to /sign-in
                    alert("Update successful! You will now be logged out.")
                    window.localStorage.removeItem("token");
                    window.location.href = "./sign-in";
                }
                else if (res.status === 422) {
                    alert("Unsuccessful update. This email address may already be in use.")
                }
                //Else a bad response
                else {
                    //Send a popup stating unsuccessful update
                    alert("Unsuccessful update.")
                }
            });
        }
        // else they didn't confirm, do nothing
    }

    //render() displays what the web page will actually look like
    render() {
        return (
            //Everything within <form></form> (the user input) will be sent to the handleSubmit function
            <form onSubmit={this.handleSubmit}>
                
                <h3 className='title-name'>Edit Profile</h3>

                {/*First Name Input*/}
                <div className="mb-3">
                    <label>First name</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder={this.state.userInfo.fname}
                    onChange={e=>this.setState({fname:e.target.value})}
                    />
                </div>

                {/*Last Name Input*/}
                <div className="mb-3">
                    <label>Last name</label>
                    <input 
                    type="text" 
                    className="form-control" 
                    placeholder={this.state.userInfo.lname}
                    onChange={e=>this.setState({lname:e.target.value})}
                    />
                </div>  

                {/*Email Input*/}
                <div className="mb-3">
                    <label>Email </label>
                    <input
                    type="email"
                    className="form-control"
                    placeholder={this.state.userInfo.email}
                    onChange={e=>this.setState({email:e.target.value})}
                    />
                </div>

                {/*Password Input*/}
                <div className="mb-3">
                    <label>Password</label>
                    <input
                    type="password"
                    className="form-control"
                    password={this.state.userInfo.password}
                    onChange={e=>this.setState({password:e.target.value})}
                    />
                </div>

                {/*Submit Button*/}
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </div>
            </form>
        );
    }
}