import React from 'react';
import {SERVER_URL} from '../config/configuration.js';
import { Link } from "react-router-dom";

const axios = require('axios');

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };
    }

    onChangeUsername = (e) => {
        this.setState({ username: e.target.value })
    }

    onChangePassword = (e) => {
        this.setState({ password: e.target.value })
    }

    onSubmit = (e) => {
        e.preventDefault();

        const userObject = {
            username: this.state.username,
            password: this.state.password
        };

        axios.post(SERVER_URL + '/users/login', userObject)
            .then((res) => {
                localStorage.setItem("token", res.data);
                this.props.history.push('/');
            }).catch((error) => {
                console.log(error);
            });

        this.setState({
            username: '',
            password: ''
        });
    }

    render() {
        return (
        <div className="form-container">
            <fieldset>
                <legend>Log in</legend>

                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={this.state.username} onChange={this.onChangeUsername} className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={this.state.password} onChange={this.onChangePassword} className="form-control" />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Login" className="btn btn-submit" />
                    </div>
                </form>
                <Link to="/signin">No account?</Link>
            </fieldset>
        </div>)
    }
}

export default Login