import React, { useState, useEffect } from "react";
import "./SeatLayout.css";
import { useSelector } from "react-redux";
import BookingDetails from "../BookingDetails/BookingDetails";

import paymentsImg from "./Images/image.png";
import planelayout from "./Images/planelayout.png";
import seatlayout from "./Images/seatlayout.png";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Toast } from "bootstrap";
import { useNavigate } from "react-router-dom";

export default function SeatLayout() {
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  var [cardNumber, setCardNumber] = useState();
  var [cvv, setCvv] = useState();
  var [expiry, setExpiry] = useState();

  var navigate = useNavigate();

  // changed here
  const [cardNumberError, setcardNumberError] = useState('');
  const [expiryError, setExpiryError] = useState('');
  const [cvvError, setcvvError] = useState('');
  const [formError, setFormError] = useState('');

  const validatecardNumber = (cardnumber) => {
    if(!cardnumber)
    {
      toast("Please enter cardNumber");
      return false;
    }
    else if (cardnumber.length !== 16) {
      toast('Card number should contain exactly 16 characters.');
      return false;
    }
     else 
     {
      setcardNumberError('');
      return true;
    }
  };
  const validexpiry = (Expiry) => {
    if (!Expiry) {
      toast("Please enter an expiry date");
      return false;
    }
    const today = new Date();
    const [month, year] = Expiry.split('/').map(Number);
    const expiryDate = new Date(year, month - 1, 1); // Creating a date object with the entered month and year
    // Check if the entered value matches the MM/YYYY format
    if (/^(0[1-9]|1[0-2])\/\d{4}$/.test(Expiry) && expiryDate > today) {
      // Check if expiry date is not in the past
      setExpiryError('');
      return true;
    } else if (Expiry === '' || /^\d{0,2}\/$/.test(Expiry)) {
      // Allow empty string or partially entered MM/
      toast("Invalid Expiry date");
      return false;
    }
  };
  
  const validcvv = (CVV) => {
    if (!CVV) {
      toast("Please enter CVV");
      return false;
    } else if (!/^\d{3}$/.test(CVV)) {
      toast("CVV should contain exactly 3 digits.");
      return false;
    } else {
      setcvvError("");
      return true;
    }
  };
  //till here

  var selectedFlight = useSelector((state) => state.selectedFlight);
  var passengerIds = useSelector((state) => state.passengerIds);

  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([]);
  var SelectSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      console.log("seat is already booked");
    } else {
      if (selectedSeatNumbers.includes(seatNumber)) {
        const updatedSelectedSeats = selectedSeatNumbers.filter(
          (seat) => seat !== seatNumber
        );
        setSelectedSeatNumbers(updatedSelectedSeats);
        return;
      } else {
        if (selectedSeatNumbers.length + 1 > passengersIds.length) {
          toast(`You can select only ${passengerIds.length} seats.`)
          return
        }
        setSelectedSeatNumbers([...selectedSeatNumbers, seatNumber]);
      }
    }
    console.log(selectedSeatNumbers);
  };

  useEffect(() => {
    console.log("Selected Seats:", selectedSeatNumbers);
  }, [selectedSeatNumbers]);

  useEffect(() => {
    fetch("https://localhost:7035/api/SeatDetail")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        res = res.sort(
          (a, b) =>
            parseInt(a.seatNo.slice(1)) - parseInt(b.seatNo.slice(1))
        );
        setSeats(res);
      });
  }, []);

  const params = new URLSearchParams({
    scheduleId: selectedFlight.scheduleId,
  });

  useEffect(() => {
    console.log(selectedFlight);
    fetch(
      `https://localhost:7035/api/Booking/GetBookedSeats?${params.toString()}`
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(sessionStorage);
        console.log(res);
        setBookedSeats(res);
      });
  }, []);

  var [payments, setPayments] = useState(false);
  function Payments() {
    if(selectedSeatNumbers.length > 0)
    {
      setPayments(true);
    }
    else 
    {
      toast("Please select seats before proceeding payment");
    }
    console.log(passengerIds);
  }

  var [scheduleId, setScheduleId] = useState(selectedFlight.scheduleId);
  var [FlightId, setFlightId] = useState(selectedFlight.flightNumber);
  console.log(FlightId);
  var [userId, setUserId] = useState(sessionStorage.getItem("customerId"));
  var [bookingTime, seatBookingTime] = useState(Date.now);
  var [passengersIds, setPassengers] = useState(passengerIds);
  var [paymentDetails, setPaymentDetails] = useState({ 'cardNumber': cardNumber, 'expiryDate': expiry, 'cvv': cvv })
  var [ticketPrice, setTicketPrice] = useState(selectedFlight.totalPrice);
  var bookingDetails = {}

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
  };
  const handleExpiryChange = (e) => {
    setExpiry(e.target.value);
  };
  const handleCvvChange = (e) => {
    setCvv(e.target.value);
  };

  function BookTicket() {

    if (!cardNumber || !cvv || !expiry) {
      toast("Please enter card details")
      return;
    }

    if (!validatecardNumber(cardNumber) || !validexpiry(expiry) || !validcvv(cvv)) {
      toast('Please enter valid details.');
      return;
    }

    bookingDetails.scheduleId = scheduleId;
    bookingDetails.customerId = parseInt(userId);
    bookingDetails.bookingTime = new Date().toISOString();
    bookingDetails.passengerIds = passengersIds;
    bookingDetails.selectedSeats = selectedSeatNumbers;
    bookingDetails.paymentDetails = { 'cardNumber': cardNumber, 'expiryDate': expiry, 'cvv': cvv };
    bookingDetails.price = ticketPrice;
    console.log(bookingDetails);

    var RequestOption = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(bookingDetails),
    };

    fetch(`https://localhost:7035/api/CustomerDashboard/${userId}/bookings`, RequestOption)
      .then((res) => res.json())
      .then((res) => {
        console.log("Response:", res);
        toast(`Booking added successfully. Click here to continue`, {
          onClick: () => navigate("/user/userAccount")
        });
      })
      .catch((err) => {
        console.error("Error:", err);
        toast("Error adding booking");
      });

  }
  return (
    <div className="seat-layout">
      <div className="seat-color-div">
        <div className="seat-availability">
        <img src={seatlayout} style={{width: '270%' , height:'700%',marginLeft: "650%",marginBottom: "-90%",marginTop:"50%"}}/>
          <div><p className="booked-seats"></p>Booked Seats</div>
          <div><p className="avilable-seats"></p>Available Seats</div>
          <div><p className="selected-seats"></p>Selected Seats</div>
        </div>
      </div>
      <div className="seat-layout-div">
      <img className="planelayout" src={planelayout} style={{ width: '100%', height: '120%',marginTop: "10%",marginRight:"50%" }} />
        <div className="seat-selection">
          <div className="seat-arrangement">
            {seats.filter(cb => cb.flightNumber === FlightId).map((seat, index) => (
              <div
                key={index}
                className={`flight ${bookedSeats.includes(seat.seatNo) ? "booked" : ""
                  }  ${selectedSeatNumbers.includes(seat.seatNo)
                    ? "selected"
                    : ""
                  }`}
                onClick={() => SelectSeat(seat.seatNo)}
              >
                 <div id="seats"style={{ fontSize: '9px' }}> {seat.seatNo}</div>
              </div>
            ))}
          </div>
         
        </div>
        { bookingDetails.selectedSeats !== null && <button onClick={Payments} className="pay-btn">
          Make Payment
        </button>}
      </div>
      {payments && (
        <div className="payments">
          <div className="payment-form mt-4 payment-form-div">
            <div>
            <h4>Enter your Payment Details</h4>
            <img className="payments-img" src={paymentsImg} />
            </div>
            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label">
                  Card Number*
              </label>
              <input
                type="text"
                className="form-control"
                id="cardNumber"
                required
                maxLength="16"
                value={cardNumber}
                onChange={handleCardNumberChange}
              />
            </div>
             {/* Changed here */}
            <span style={{ color: 'red' }}>{cardNumberError}</span>
              {/* till here */}
            <div className="mb-3">
              <label htmlFor="expiryDate" className="form-label">
              Expiry Date*
              </label>
              <input
                type="text"
                className="form-control"
                id="expiryDate"
                placeholder="MM/YYYY"
                value={expiry}
                onChange={handleExpiryChange}
                required
              />
            </div>
            {/* Changed here */}
            <span style={{ color: 'red' }}>{expiryError}</span>
              {/* till here */}
            <div className="mb-3">
              <label htmlFor="cvv" className="form-label">
                  CVV*
              </label>
              <input
                type="password"
                className="form-control"
                id="cvv"
                maxLength="3"
                value={cvv}
                onChange={handleCvvChange}
                required
              />
            </div>
            {/* Changed here */}
            <span style={{ color: 'red' }}>{cvvError}</span>
              {/* till here */}

            <button
              type="button"
              className="btn btn-book-flight btn-block mt-3 book-ticket-btn"
              onClick={BookTicket}
            >
              Book Flight
            </button>
              {/* Changed here */}
              <span style={{ color: 'red' }}>{formError}</span>
            {/* till here */}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
