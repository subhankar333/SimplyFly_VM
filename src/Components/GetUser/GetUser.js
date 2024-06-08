import React, { useState, useEffect } from 'react'
import './GetUser.css'
import axios from 'axios';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function GetUser() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const httpHeader = {
      headers: { 'Authorization': 'Bearer ' + token }
    };

     fetch("https://localhost:7035/api/AdminDashboard/Users/AllCustomers", httpHeader)
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
        setUsers(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const token = sessionStorage.getItem('token');
  function DeleteUser(username) {
    const confirmDelete = window.confirm(`Are you sure you want to delete user ${username}?`);
    if (confirmDelete) {
      var RequestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + token },
      };

      fetch(`https://localhost:7035/api/AdminDashboard/DeleteUserByUsername?username=${username}`, RequestOptions)
        .then((res) => res.json())
        .then((res) => { toast("User deleted successfully")})
        .catch((err) => {
          toast("Something went wrong, user not deleted");
        });
    }
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='get-user-div'>
      {currentUsers.map((user, index) => (
        <div key={index} className="user-list-div">
          <div className='user-name-div user-row'><p>Name : </p>{user.name}</div>
          <div className='user-gender-div user-row'><p>Gender : </p>{user.gender}</div>
          <div className='user-email-div user-row'><p>Email : </p>{user.email}</div>
          <div className='user-phone-div user-row'><p>Phone : </p>{user.phone}</div>
          <div className='delete-user-btn' onClick={() => DeleteUser(user.username)}>X</div>
        </div>
      ))}
      <div className='pagination'>
        {users.length > usersPerPage && (
          <>
            <button onClick={() => {currentPage > 1 && paginate(currentPage - 1)}}>Previous</button>
            <button onClick={() => paginate(currentPage + 1)}>Next</button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  )
}
