import React, { useEffect, useState } from "react";
import "./UpdateFlight.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function UpdateFlight() {
  const [updateAirline, setUpdateAirline] = useState(true);
  const [updateSeats, setUpdateSeats] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [flightNumber, setFlightNumber] = useState();
  const [airline, setAirline] = useState("");
  const [seats, setSeats] = useState("");
  const [status, setStatus] = useState("");
  const [flights, setFlights] = useState([]);
  const [seatError, setSeatError] = useState("");
  const [formError, setFormError] = useState("Enter all the required fields");
  const [isFilledAll, setIsFilledAll] = useState(false);
  const token = sessionStorage.getItem('token');
  const flightOwnerId = sessionStorage.getItem("ownerId");

  useEffect(() => {
    const httpHeader = { headers: { 'Authorization': 'Bearer ' + token } };
    axios.get(`https://localhost:7035/api/Flight/GetAllFlights/flightOwnerId?flightOwnerId=${flightOwnerId}`, httpHeader)
      .then(response => {
        setFlights(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function validateSeat(noOfSeats) {
    if (noOfSeats <= 0 || noOfSeats > 120) {
      toast("Total Seats can't be negative and greater than 120");
      return false;
    } else {
      setSeatError("");
      return true;
    }
  }

  var UpdateFlightAirline = (e) => {
    e.preventDefault();
    if (!flightNumber || !airline) {
      toast("Please enter the required details");
      return;
    }
    const updateAirlineDetail = { flightNumber, airline };
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(updateAirlineDetail)
    };

    fetch("https://localhost:7035/api/Flight", requestOptions)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        toast('Flight airline update successful');
      })
      .catch(err => {
        console.error('Error:', err);
        toast('Error updating flight.');
      });
  };

  var UpdateFlightSeats = (e) => {
    e.preventDefault();
    if (!flightNumber || !seats) {
      setIsFilledAll(true);
      return;
    } else if (!validateSeat(seats)) {
      setSeatError("Total Seats can't be negative and greater than 120");
      return;
    }
    setIsFilledAll(false);

    const updateSeatsDetail = { flightNumber, totalSeats: parseInt(seats) };
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(updateSeatsDetail)
    };

    fetch("https://localhost:7035/api/Flight/UpdateTotalSeats", requestOptions)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        toast('Flight seats update successful');
      })
      .catch(err => {
        console.error('Error:', err);
        toast('Error updating flight.');
      });
  };

  var UpdateFlightStatus = (e) => {
    e.preventDefault();
    if (!flightNumber || !status) {
      alert("Please enter the required details");
      return;
    }
    const updateStatusDetail = { flightNumber, status: parseInt(status) };
    const requestOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(updateStatusDetail)
    };

    fetch(`https://localhost:7035/api/Flight/UpdateFlightStatus?flightNumber=${flightNumber}&status=${status}`, requestOptions)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        toast('Flight status update successful');
      })
      .catch(err => {
        console.error('Error:', err);
        toast('Error updating flight status.');
      });
  };

  const handleFlightNumberChange = (e) => {
    setFlightNumber(e.target.value);
  };

  return (
    <div className="update-flight-div">
      <div className="update-options-div">
        <div className={`update-option ${updateAirline ? 'active' : ''}`} onClick={() => { setUpdateAirline(true); setUpdateSeats(false); setUpdateStatus(false); }}>Update Airline</div>
        <div className={`update-option ${updateSeats ? 'active' : ''}`} onClick={() => { setUpdateAirline(false); setUpdateSeats(true); setUpdateStatus(false); }}>Update Seats</div>
        <div className={`update-option ${updateStatus ? 'active' : ''}`} onClick={() => { setUpdateAirline(false); setUpdateSeats(false); setUpdateStatus(true); }}>Update Status</div>
      </div>

      <div className="update-div">
        {updateAirline && (
          <div className="form-container">
            <label htmlFor="flight-number"><b>Flight Number:</b></label>
            <select className="select-destination-airport" onChange={handleFlightNumberChange}>
              <option value="0">--Select flight--</option>
              {flights.map((flight) => (
                <option key={flight.flightNumber} value={flight.flightNumber}>
                  {flight.flightNumber}
                </option>
              ))}
            </select>
            <label htmlFor="airline"><b>Airline:</b></label>
            <input type="text" placeholder="Enter Airline" value={airline} onChange={(e) => setAirline(e.target.value)} />
            <button className='update-flight-btn' onClick={UpdateFlightAirline}>Update Flight</button>
          </div>
        )}

        {updateSeats && (
          <div className="form-container">
            <label htmlFor="flight-number"><b>Flight Number:</b></label>
            <select className="select-destination-airport" onChange={handleFlightNumberChange}>
              <option value="0">--Select flight--</option>
              {flights.map((flight) => (
                <option key={flight.flightNumber} value={flight.flightNumber}>
                  {flight.flightNumber}
                </option>
              ))}
            </select>
            <label htmlFor="seats"><b>Seats:</b></label>
            <input type="number" placeholder="Enter Seats" value={seats} onChange={(e) => { setSeats(e.target.value); validateSeat(e.target.value); }} />
            {seatError && <span className="error-message">{seatError}</span>}
            <button className='update-flight-btn' onClick={UpdateFlightSeats}>Update Flight</button>
            {isFilledAll && <span className="error-message">{formError}</span>}
          </div>
        )}

        {updateStatus && (
          <div className="form-container">
            <label htmlFor="flight-number"><b>Flight Number:</b></label>
            <select className="select-destination-airport" onChange={handleFlightNumberChange}>
              <option value="0">--Select flight--</option>
              {flights.map((flight) => (
                <option key={flight.flightNumber} value={flight.flightNumber}>
                  {flight.flightNumber}
                </option>
              ))}
            </select>
            <label htmlFor="status"><b>Status:</b></label>
            <input type="number" placeholder="Enter Status" min={0} max={1} value={status} onChange={(e) => setStatus(e.target.value)} />
            <button className='update-flight-btn' onClick={UpdateFlightStatus}>Update Flight</button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}
