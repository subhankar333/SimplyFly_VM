import React, { useEffect, useState } from 'react'
import './GetFlightOwner.css'
import axios from 'axios'


import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Toast } from 'bootstrap';


export default function GetFlightOwner() {
  var [flightOwner, setFlightOwner] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);


  useEffect(() => {
    const token = sessionStorage.getItem('token')
    const httpHeader = {
      headers: { 'Authorization': 'Bearer ' + token }
    }

    fetch("https://localhost:7035/api/AdminDashboard/Users/AllFlightOwners", httpHeader)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setFlightOwner(res);
      });
  });

  const token = sessionStorage.getItem('token')
  function DeleteFlightOwner(username) {
    const confirmDelete = window.confirm(`Are you sure you want to delete user ${username}?`);
    if (confirmDelete) {
      var RequestOptions = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        },
      };

      fetch(`https://localhost:7035/api/AdminDashboard/DeleteUserByUsername?username=${username}`, RequestOptions)
        .then((res) => res.json)
        .then((res) => {toast("Flightowner deleted successfully") })
        .catch((err) => {
          Toast("Something went wrong");
        });
    }
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = flightOwner.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='getflightOwner-div'>
      <div className='get-flightOwner-div'>
        {currentUsers.map((user, index) => (
          <div key={index} className="flightOwner-list-div">
            <div className='user-name-div flightOwner-row'><p>Name : </p>{user.name}</div>
            <div className='user-email-div flightOwner-row'><p>Email : </p>{user.email}</div>
            <div className='user-phone-div flightOwner-row'><p>Phone : </p>{user.contactNumber}</div>
            <div className='user-gender-div flightOwner-row'><p>Company Name : </p>{user.companyName}</div>
            <div className='delete-user-btn' onClick={() => { DeleteFlightOwner(user.username) }}>X</div>
          </div>))}
      </div>
             
      <div className="pagination-container">
        <div className='pagination'>
          {(flightOwner.length > usersPerPage && currentPage > 1) && (
            <button onClick={() => paginate(currentPage - 1)}>Previous</button>
          )}
          {flightOwner.length > indexOfLastUser && (
            <button onClick={() => paginate(currentPage + 1)}>Next</button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
