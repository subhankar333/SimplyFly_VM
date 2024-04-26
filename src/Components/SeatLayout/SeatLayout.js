import React, { useState, useEffect } from "react";
import "./SeatLayout.css";
import { useSelector } from "react-redux";
import BookingDetails from "../BookingDetails/BookingDetails";

export default function SeatLayout() {
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  var [cardNumber, setCardNumber] = useState();
  var [cvv, setCvv] = useState();
  var [expiry, setExpiry] = useState();

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
          alert(`You can select only ${passengerIds.length} seats.`)
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
    setPayments(true);
    console.log(passengerIds);
  }

  var [scheduleId, setScheduleId] = useState(selectedFlight.scheduleId);
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
      alert("Please enter card details")
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
        alert("Booking added successfully");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Error adding booking");
      });

  }
  return (
    <div className="seat-layout">
      <div className="seat-color-div">
        <div className="seat-availability">
          <div><p className="booked-seats"></p>Booked Seats</div>
          <div><p className="avilable-seats"></p>Available Seats</div>
          <div><p className="selected-seats"></p>Selected Seats</div>
        </div>
      </div>
      <div className="seat-layout-div">
        <div className="seat-selection">
          <div className="seat-arrangement">
            {seats.map((seat, index) => (
              <div
                key={index}
                className={`flight ${bookedSeats.includes(seat.seatNo) ? "booked" : ""
                  }  ${selectedSeatNumbers.includes(seat.seatNo)
                    ? "selected"
                    : ""
                  }`}
                onClick={() => SelectSeat(seat.seatNo)}
              >
                <div id="seats"> {seat.seatNo}</div>
              </div>
            ))}
          </div>
          <div className="passage"></div>
        </div>
        <button onClick={Payments} className="pay-btn">
          Make Payment
        </button>
      </div>
      {payments && (
        <div className="payments">
          <div className="payment-form mt-4 payment-form-div">
            <h4>Payment Details</h4>
            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label">
                Card Number
              </label>
              <input
                type="text"
                className="form-control"
                id="cardNumber"
                required
                value={cardNumber}
                onChange={handleCardNumberChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="expiryDate" className="form-label">
                Expiry Date
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
            <div className="mb-3">
              <label htmlFor="cvv" className="form-label">
                CVV
              </label>
              <input
                type="password"
                className="form-control"
                id="cvv"
                value={cvv}
                onChange={handleCvvChange}
                required
              />
            </div>

            <button
              type="button"
              className="btn btn-book-flight btn-block mt-3 book-ticket-btn"
              onClick={BookTicket}
            >
              Book Flight
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
