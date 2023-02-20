import React, {Component} from "react";
import './css/LoginAndSignUp.css';

export default class UserInfo extends Component{

    constructor(props){
        super(props);
        //TODO - Change my comment to be more accurate or precise.
        //Defines the current state, in this case the information of the current user
        this.state = {
            userInfo: ""
        };
        //Adds functionality to the Submit button
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //componentDidMount sends a HTTP POST request to backend
    componentDidMount(){
        //See server.js for server.post(/userInfo)
        fetch("http://localhost:5000/users/userInfo", {
        method: "POST",
        crossDomain:true,
        headers:{
            "Content-Type":"application/json",
            Accept:"application/json",
            "Access-Control-Allow-Origin":"*",
        },
        //TODO - Change my comment to be more accurate or precise.
        //Turns the token received from the backend into a string???
        body:JSON.stringify({
            token:window.localStorage.getItem("token"),
        }),
        //Get a response (res) from the server, then the json format of it?
        }).then((res)=>res.json())
        //Use the user data from the response
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

        if (confirm)
        {
            //Defines the current user _id
            const _id = this.state.userInfo._id;

            //TODO - State what's going on here.
            const{fname, lname, email, password} = this.state;
            
            //Console data check to make sure nothing is wonky in the data
            console.log(_id, fname, lname, email, password);

            //Make a PUT HTTP request to backend (See server.js for server.put(/user/update/:id))
            fetch(`http://localhost:5000/users/update/${_id}`, {
            method: "PUT",
            crossDomain: true,
            headers:{
                "Content-Type":"application/json",
                Accept:"application/json",
                "Access-Control-Allow-Origin":"*",
            },
            //TODO - Change my comment to be more accurate or precise.
            //Turns the token received from the backend into a string???
            body:JSON.stringify({
                fname,
                lname,
                email, 
                password
                }),
            //Get a response (res) from the server
            }).then((res)=>{
                //If a good response
                if (res.ok) {
                    //Send a popup stating successful edit, then reload page
                    //alert("Update successful! Reloading page.")
                    //window.location.reload()

                    //Send a popup stating successful edit, then redirect page to user profile (/myprofile)
                    alert("Update successful! You will now be logged out.")
                    window.localStorage.removeItem("token");
                    window.location.href = "./sign-in";
                }
                else if (res.status === 422)
                {
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