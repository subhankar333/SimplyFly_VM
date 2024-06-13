import React, { useEffect, useState } from 'react'
import './AddFlight.css'
import { json } from 'react-router-dom';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function AddFlight() {
  // var [flightNumber, setFlightNumber] = useState();
  var [airline, setAirline] = useState();
  var [totalSeats, setTotalSeats] = useState();
  var [basePrice, setBasePrice] = useState();

  var [totalEconomySeats, setTotalEconomySeats] = useState();
  var [totalBusinessSeats, setTotalBusinessSeats] = useState();
  var [totalPremiumEconomySeats, setTotalPremiumEconomySeats] = useState();

  var [economySeatPrice, setEconomySeatPrice] = useState();
  var [businessSeatPrice, setbusinessSeatPrice] = useState();
  var [premiumEconomySeatPrice, setPremiumEconomySeatPrice] = useState();

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
        //console.log(res);
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


  function validatePrice(seatPrice)
  {
    console.log("Validate price :" + seatPrice);
    if(seatPrice <= 3000)
    {
      toast("Seat Price should be gretaer than 3000");
      return false;
    }
    else 
    {
      setSeatError("");
      return true;
    }
  }
 

  var flightDetails = {}
  var AddFlight = (e) => 
  {
      //changed here
    if (!totalEconomySeats || !totalBusinessSeats || !totalPremiumEconomySeats || !economySeatPrice || !businessSeatPrice || !premiumEconomySeatPrice) {
      setIsFilledAll(true);
      return;
    }
    else if(!validateSeat(totalEconomySeats) || !validateSeat(totalBusinessSeats) || !validateSeat(totalPremiumEconomySeats))
    {
      toast("Number of Seats can't be negative and greater than 120");
      return;
    }
    // else if(!validatePrice(economySeatPrice) || !validatePrice(businessSeatPrice) || !validatePrice(premiumEconomySeatPrice))
    // {
    //     toast("Seat Price should be gretaer than 3000");
    //     return;
    // }
      //changed here
  
      //changed this line
    setIsFilledAll(false);
    e.preventDefault();
    //flightDetails.flightNumber = flightNumber;
    flightDetails.airline = company;
    flightDetails.totalEconomySeats = parseInt(totalEconomySeats);
    flightDetails.totalBusinessSeats = parseInt(totalBusinessSeats);
    flightDetails.totalPremiumEconomySeats = parseInt(totalPremiumEconomySeats);
    flightDetails.economySeatPrice = parseInt(economySeatPrice);
    flightDetails.businessSeatPrice = parseInt(businessSeatPrice);
    flightDetails.premiumEconomySeatPrice = parseInt(premiumEconomySeatPrice);
    flightDetails.flightOwnerId = parseInt(sessionStorage.getItem('ownerId'))
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
        
        <div className='flight-airline-div flight-detail-div'>
          <label htmlFor='flight-airline'><b>Airline : </b></label>
          <input type='text' placeholder='Enter airline' value={company} readOnly />
        </div>

        {/* changed here */}
        {/* <div className='total-seats-div flight-detail-div'>
          <label htmlFor='total-seats'><b>Total Seats : </b></label>
          <input type='number' placeholder='Enter total seats' value={totalSeats} onChange={(e) => {setTotalSeats(e.target.value);validateSeat(e.target.value)}} required />
        </div> */}

        <div className='total-seats-div flight-detail-div'>
          <label htmlFor='total-economy-seats'><b>Total Economy Seats : </b></label>
          <input type='number' placeholder='Enter total Economy seats' value={totalEconomySeats} onChange={(e) => {setTotalEconomySeats(e.target.value);}} onBlur={(e) => validateSeat(e.target.value)} required />
        </div>

        <div className='total-seats-div flight-detail-div'>
          <label htmlFor='total-business-seats'><b>Total Business Seats : </b></label>
          <input type='number' placeholder='Enter total Business seats' value={totalBusinessSeats} onChange={(e) => {setTotalBusinessSeats(e.target.value);}} onBlur={(e) => validateSeat(e.target.value)} required />
        </div>

        <div className='total-seats-div flight-detail-div'>
          <label htmlFor='total-premiumeconomy-seats'><b>Total Premium Economy Seats : </b></label>
          <input type='number' placeholder='Enter total Premium Economy seats' value={totalPremiumEconomySeats} onChange={(e) => {setTotalPremiumEconomySeats(e.target.value);}} onBlur={(e) => validateSeat(e.target.value)} required />
        </div>

        <span style={{ color: 'red' }}>{seatError}</span>
        {/* till here */}



        {/* <div className='base-price-div flight-detail-div'>
          <label htmlFor='base-price'><b>Base Price : </b></label>
          <input type='number' placeholder='Enter base price' value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
        </div> */}

        <div className='base-price-div flight-detail-div'>
          <label htmlFor='economy-seat-price'><b>Economy Seat Price : </b></label>
          <input type='number' placeholder='Enter Economy class price' value={economySeatPrice} onChange={(e) => {setEconomySeatPrice(e.target.value);}} onBlur={(e) => validatePrice(e.target.value)}  required />
        </div>

        <div className='base-price-div flight-detail-div'>
          <label htmlFor='business-seat-price'><b>Business Seat Price : </b></label>
          <input type='number' placeholder='Enter Business class price' value={businessSeatPrice} onChange={(e) => setbusinessSeatPrice(e.target.value)} onBlur={(e) => validatePrice(e.target.value)} required />
        </div>

        <div className='base-price-div flight-detail-div'>
          <label htmlFor='premiumeconomy-seat-price'><b>Premium Economy Seat Price : </b></label>
          <input type='number' placeholder='Enter Premium Economy class price' value={premiumEconomySeatPrice} onChange={(e) => setPremiumEconomySeatPrice(e.target.value)} onBlur={(e) => validatePrice(e.target.value)} required />
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
