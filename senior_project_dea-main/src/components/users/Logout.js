import React, { Component } from 'react'

class Logout extends Component {
    componentDidMount() {
        window.localStorage.removeItem("token");
        window.location.href = "./sign-in";
    }

    render() {
        return (<>Signing out...</>);
    }
}

export default Logout;