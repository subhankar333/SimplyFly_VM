import React, { useState, useEffect } from 'react';
import './DeleteFlight.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function DeleteFlight() {
  const [flightNumber, setFlightNumber] = useState('');
  const [flights, setFlights] = useState([]);
  const flightOwnerId = sessionStorage.getItem('ownerId');

  const handleFlightNumberChange = (e) => {
    setFlightNumber(e.target.value);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const httpHeader = {
      headers: { Authorization: 'Bearer ' + token }
    };

    axios
      .get(`https://localhost:7035/api/Flight/GetAllFlights/flightOwnerId?flightOwnerId=${flightOwnerId}`, httpHeader)
      .then(function (response) {
        setFlights(response.data);
        console.log(flights);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const DeleteFlightFun = (e) => {
    e.preventDefault();

    if (!flightNumber) {
      toast.error('Please select a flight number');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to remove the flight?`);
    if (confirmDelete) {
      const token = sessionStorage.getItem('token');
      const requestOptions = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        }
      };

      fetch(`https://localhost:7035/api/Flight?flightNumber=${flightNumber}`, requestOptions)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          toast.success('Flight deleted successfully');
        })
        .catch((err) => {
          console.error('Error:', err);
          toast.error('Error deleting flight');
        });
    }
  };

  return (
    <div className='delete-flight-container'>
      <div className='delete-flight-form'>
        <label htmlFor='flight-number'><b>Select Flight Number:</b></label>
        <select
          className='select-flight-number'
          value={flightNumber}
          onChange={handleFlightNumberChange}
        >
          <option value=''>-- Select flight --</option>
          {flights.map((flight) => (
            <option key={flight.flightNumber} value={flight.flightNumber}>
              {flight.flightNumber}
            </option>
          ))}
        </select>
        <button type='button' className='delete-flight-btn' onClick={DeleteFlightFun}>
          Delete Flight
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
