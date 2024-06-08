import React, { useState } from "react";
import "./ManageUser.css";
import GetUser from "../GetUser/GetUser";
import GetFlightOwner from "../GetFlightOwner/GetFlightOwner";
import useronline from "./Images/useronline.png";
import rightArrow from '../../Assets/Images/right-arrow.png'
import leftArrow from '../../Assets/Images/left-arrow.png'

export default function ManageUser() {
  const [getUser, setGetUser] = useState(true);
  const [getFlightOwner, setGetFlightOwner] = useState(false);
  const [removeUser, setRemoveUser] = useState(false);
  const [removeFlightOwner, setRemoveFlightOwner] = useState(false);


  function DisplayOptions() {
    var sidebar = document.getElementById('account-sidebar');
    var mainContainer = document.getElementById('container-main')
    if(sidebar)
    {
      sidebar.style.display = "flex"
    }
    if(mainContainer)
    {
      mainContainer.style.display = "none"
    }
  }
  
  function DisplayMain() {
    var sidebar = document.getElementById('account-sidebar');
    var mainContainer = document.getElementById('container-main')
    if(sidebar)
    {
      sidebar.style.display = "none"
    }
    if(mainContainer)
    {
      mainContainer.style.display = "flex"
    }
  }

  return (
    <div>
      <div className="container-body">
        <div className="sidebar" id='account-sidebar'>
          <div className="sidebar-container">
          <div className="dashboard-heading">
            <img src={useronline} className="user-online" style={{ display: "block", height: "50%", width:"50%",marginBottom: "10px",marginLeft:"70px" }}/>
          <h2 style={{ fontSize: "20px", color: "white",textAlign: "center"}}>Dashboard</h2>
          </div>
          <div className="more-profile-option"><img src={leftArrow} className="right-arrow" onClick={DisplayMain}/></div>
            <div
              className="sidebar-option"
              onClick={() => {
                setGetUser(true);
                setGetFlightOwner(false);
                setRemoveUser(false);
                setRemoveFlightOwner(false);
              }}
            >
              Get Users
            </div>

            <div
              className="sidebar-option"
              onClick={() => {
                setGetUser(false);
                setGetFlightOwner(true);
                setRemoveUser(false);
                setRemoveFlightOwner(false);
              }}
            >
              Get FlightOwner
            </div>
          </div>
        </div>
        <div className="container-main">
        <div className="more-profile-option"><img src={rightArrow} className="right-arrow" onClick={DisplayOptions}/></div>
          {getUser && (
            <div className="get-User">
              <GetUser />
            </div>
          )}
          {getFlightOwner && (
            <div className="get-flightOwner">
              <GetFlightOwner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}