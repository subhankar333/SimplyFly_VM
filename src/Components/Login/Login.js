import React, { useState } from "react";
import "./Login.css";
import userImg from "../../Assets/Images/user.png";
import key from "../../Assets/Images/key.png";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "./Images/image.png";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


export default function Login() {

  const navigate = useNavigate();
  var [Username, setUsername] = useState('');
  var [Password, setPassword] = useState('');
  var [userDetails, setUserDetails] = useState([]);

  // changed here
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');

  const validateUsername = (username) => {
    if(!username)
    {
      toast("Please enter username");
      return false;
    }
    else if (/^[^a-zA-Z0-9]/.test(username)) {
      toast('Username should not start with a special character.');
      return false;
    } else if (/^\d/.test(username)) {
      toast('Username should not start with a digit.');
      return false;
    }
     else 
     {
      setUsernameError('');
      return true;
    }
  };

  const validatePassword = (password) => {
    if(!password)
    {
       toast("Please enter password");
       return false;
    }
      
      setPasswordError("");
      return true;

  };
  // till here
 
  

  var user = {};
  var Login = (e) => {

    var check = false;
  
// changed here
    if (validateUsername(Username) && validatePassword(Password)) {
           setUsernameError("");
           setPasswordError("");
           check = true;
    }
    else {
      toast("Please fix the errors before logging in.")
      
    }
  //till here

    e.preventDefault();
    user.Username = Username;
    user.Password = Password;
    user.role = "";
    user.token = "";
    // user.ownerId = "";
    var requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };

    fetch("https://localhost:7035/api/User/Login", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        sessionStorage.setItem("token", res.token);
        sessionStorage.setItem("username", res.username);
        sessionStorage.setItem("role", res.role);
        alert('Login success ✔ ' + res.username);

        if (sessionStorage.getItem("role") == "flightowner") {
          console.log("flightOwner");
          var getRequestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          };

          const params = new URLSearchParams({
            username: res.username,
          });

          fetch(
            `https://localhost:7035/api/FlightOwner?${params.toString()}`,
            getRequestOptions
          )
            .then((response) => response.json())
            .then((response) => {
              // console.log(response);
              sessionStorage.setItem("ownerId", response.flightOwnerId);
              console.log(sessionStorage);
            }
            )
            .catch((err) => console.log(err));

          navigate("/flightOwner/home");
        } else if (sessionStorage.getItem("role") == "customer") {
          console.log("customer");
          var getRequestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          };

          const params = new URLSearchParams({
            username: res.username,
          });

          fetch(
            `https://localhost:7035/api/CustomerDashboard/GetCustomerByUsername?${params.toString()}`,
            getRequestOptions
          )
            .then((response) => response.json())
            .then((response) => {
              sessionStorage.setItem("customerId", response.customerId);
              console.log(sessionStorage);
            }
            )
            .catch((err) => console.log(err));

          navigate(-1);
        } else {
          var getRequestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          };

          const params = new URLSearchParams({
            username: res.username,
          });

          fetch(
            `https://localhost:7035/api/AdminDashboard/GetAdminByUsername?${params.toString()}`,
            getRequestOptions
          )
            .then((response) => response.json())
            .then((response) => {
              sessionStorage.setItem("adminId", response.adminId)
              console.log(sessionStorage);
            }
            )
            .catch((err) => console.log(err));

          navigate("/admin/home");
        }
      })
      .catch((err) => {
        console.log(err);
        // Changed here
        if(Username && Password)
        {
          toast("Invalid Credentials ");
        }
        // till here
      });
  };

  return (
    <div>
      <div className="login-page">
        <div className="login-div">
          <h3></h3>
          <h3></h3>
          <h3>Welcome Back</h3>
          
          <div className="login-img"><img src={loginImage} alt="Login Image" /></div>
          <form>
          
            <div className="username-div">
              <h2> </h2>
              <img src={userImg} />
              <input
                type="text"
                id="username-input"
                placeholder="Enter your username"
                className="login-inputs"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <span style={{ color: 'red' }}>{usernameError}</span>
            <div className="password-div">
              <img src={key} />
              <input
                type="password"
                id="password-input"
                placeholder="Enter your password"
                className="login-inputs"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <span style={{ color: 'red' }}>{passwordError}</span>
            <h6 className="forgot-password" onClick={()=>navigate('/UpdatePassword')}>forgot password?</h6>
            <input type="submit" value="Login" id="login-btn" onClick={Login} />
            <span style={{ color: 'red' }}>{formError}</span>
            <h6 className="register-user" style={{ color: 'blue', cursor: 'pointer' }} onClick={()=>navigate('/registerUser')}>Sign Up as Customer</h6>
            <h6 className="register-user" style={{ color: 'blue', cursor: 'pointer' }} onClick={()=>navigate('/register')}>Sign Up as Flight Owner</h6>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
