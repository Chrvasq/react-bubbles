import React, { useState } from "react";
import axios from "axios";

const Login = props => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleChange = e => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const logIn = () => {
    axios
      .post("http://localhost:5000/api/login", credentials)
      .then(res => {
        localStorage.setItem("token", res.data.payload);
        props.history.push("/bubblepage");
      })
      .catch(err => console.log(err.message));
  };

  const submitForm = e => {
    e.preventDefault();
    logIn();
    setCredentials({ username: "", password: "" });
  };

  return (
    <>
      <h1>Welcome to the Bubble App!</h1>
      <form onSubmit={submitForm}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={credentials.username}
          placeholder="Username"
          onChange={handleChange}
        />
        <label>Password</label>
        <input
          type="text"
          name="password"
          value={credentials.password}
          placeholder="Password"
          onChange={handleChange}
        />
        <button>Log In</button>
      </form>
    </>
  );
};

export default Login;
