import React, { useEffect, useState } from 'react'
import './AddFlight.css'
import { json } from 'react-router-dom';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function AddFlight() {
  var [flightNumber, setFlightNumber] = useState();
  var [airline, setAirline] = useState();
  var [totalSeats, setTotalSeats] = useState();
  var [basePrice, setBasePrice] = useState();

  // changed here
  const [company, setCompany] = useState("");
  const [seatError, setSeatError] = useState("");
  const [formError,setFormError] = useState("Enter all the required fields");
  var [isFilledAll, setIsFilledAll] = useState(false);
  //till here

  useEffect(()=>{
    fetch(
      `https://localhost:7035/api/FlightOwner?username=${sessionStorage.getItem(
        "username"
      )}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setCompany(res.companyName);
      });
  })

  //changed here
  function validateSeat(noOfSeats)
  {
    if(noOfSeats <= 0 || noOfSeats > 120)
    {
      toast("Total Seats can't be negative and greater than 120");
      return false;
    }
    else 
    {
      setSeatError("");
      return true;
    }
  }
  //till here
 

  var flightDetails = {}
  var AddFlight = (e) => 
  {
      //changed here
    if (!flightNumber || !totalSeats || !basePrice) {
      setIsFilledAll(true);
      return;
    }
    else if(!validateSeat(totalSeats))
    {
      toast("Total Seats can't be negative and greater than 120");
      return;
    }
      //changed here
  
      //changed this line
    setIsFilledAll(false);
    e.preventDefault();
    flightDetails.flightNumber = flightNumber;
    flightDetails.airline = company;
    flightDetails.totalSeats = parseInt(totalSeats);
    flightDetails.flightOwnerId = parseInt(sessionStorage.getItem('ownerId'))
    flightDetails.basePrice = parseFloat(basePrice);
    console.log(flightDetails)

    const token = sessionStorage.getItem('token')

    var RequestOption = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(flightDetails)
    }

    fetch("https://localhost:7035/api/Flight/AddFlight", RequestOption)
      .then(res => res.json())
      .then(res => {
        console.log('Response:', res);
        toast('Flight added successfully');
      })
      .catch(err => {
        console.error('Error:', err);
        toast('Flight Already Exists');
      });
  }

  return (
    <div className='add-flight-div'>
      <form className='add-flight-form'>
        <div className='flight-number-div flight-detail-div'>
          <label htmlFor='flight-number'><b>Flight Number : </b></label>
          <input type='text' placeholder='Enter flight number' value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} required />
        </div>
        <div className='flight-airline-div flight-detail-div'>
          <label htmlFor='flight-airline'><b>Airline : </b></label>
          <input type='text' placeholder='Enter airline' value={company} readOnly />
        </div>

        {/* changed here */}
        <div className='total-seats-div flight-detail-div'>
          <label htmlFor='total-seats'><b>Total Seats : </b></label>
          <input type='number' placeholder='Enter total seats' value={totalSeats} onChange={(e) => {setTotalSeats(e.target.value);validateSeat(e.target.value)}} required />
        </div>

        <span style={{ color: 'red' }}>{seatError}</span>
        {/* till here */}

        <div className='base-price-div flight-detail-div'>
          <label htmlFor='base-price'><b>Base Price : </b></label>
          <input type='number' placeholder='Enter base price' value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
        </div>
        <button type='button' className='add-flight-btn' onClick={AddFlight}>Add Flight</button>
        {/* changed here */}
        {isFilledAll ? <span style={{ color: 'red' }}>{formError}</span> : ""}
        {/* till here */}
      </form>
      <p></p>
      <ToastContainer/>
    </div>

    
  )
}
