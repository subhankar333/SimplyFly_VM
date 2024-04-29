import React, { useEffect, useState } from "react";
import "./GetCancellBookingCustomer.css";
import axios from "axios";
import indigo from "../../Assets/Images/indigo.png";
import airIndia from "../../Assets/Images/airindia.png";
import vistara from "../../Assets/Images/vistara.png";

export default function GetCancelBookings() {
  const [bookings, setBooking] = useState([]);
  const userId = sessionStorage.getItem("customerId");
  const token = sessionStorage.getItem("token");
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage, setBookingsPerPage] = useState();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);



  useEffect(() => {
    const httpHeader = {
      headers: { Authorization: "Bearer " + token },
    };
    
    axios
      .get(
        `https://localhost:7035/api/CustomerDashboard/GetAllCancelledBookings`,
        httpHeader
      )
      .then(function (response) {
        const sortBookings = response.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
        setBooking(sortBookings);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [token]);

  useEffect(() => {
    axios
      .get(
        `https://localhost:7035/api/AdminDashboard/Users/AllCustomers`
      )
      .then(function (response) {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  // Update bookingsPerPage on window resize
  useEffect(() => {
    const handleResize = () => {
      setBookingsPerPage(window.innerWidth <= 900 ? 1 : 4);
    };

    handleResize(); // Call initially to set bookingsPerPage

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function GetUser(id) {
    console.log("customerId " + id);
    const user = users.find((user) => user.customerId === id);
    return user ? user.name : "User Not Found";
  }

  function getDate(date) {
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return { formattedDate, formattedTime };
  }

  function getTimeDifference(departure, arrival) {
    const arrivalTime = new Date(arrival);
    const departureTime = new Date(departure);
    const timeDifference = arrivalTime - departureTime;

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    return hours + ":" + minutes + " hours";
  }

  const getAirlineImage = (airline) => {
    airline = airline.toLowerCase();
    switch (airline) {
      case "indigo":
        return indigo;
      case "air india":
        return airIndia;
      case "vistara":
        return vistara;
      default:
        return indigo;
    }
  };

  console.log(bookingsPerPage, windowWidth);
  
  var currentBookings = bookings.filter(cb => cb.booking.customerId == userId);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings1 = currentBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bookings-div">
      <div className="get-bookings-div">
        {currentBookings1.map((booking, index) => (
          <div key={index} className="booking-list-div1">
            <div className="booking-schedule-details">
              <div className="booking-flight-detail">
                <img src={getAirlineImage(booking.booking.schedule.flight.airline)} className="airline-logo" />
                <div className="flight-detail-1">
                  <p className="-bookingflight-details">{booking.booking.schedule.flight.airline}</p>
                  <p className="booking-flight-details">{booking.booking.schedule.flightNumber}</p>
                </div>
              </div>
              <div className="flight-source">
                <p className="flight-details">{booking.booking.schedule.route.sourceAirport.city}</p>
                <p className="flight-details">{getDate(new Date(booking.booking.schedule.departure)).formattedTime}</p>
              </div>
              <p className="time-diff">
                {getTimeDifference(booking.booking.schedule.departure, booking.booking.schedule.arrival)} hours
              </p>
              <div className="flight-destination">
                <p className="flight-details">{booking.booking.schedule.route.destinationAirport.city}</p>
                <p className="flight-details">{getDate(new Date(booking.booking.schedule.arrival)).formattedTime}</p>
              </div>
              <div className="refund-status-container">
              </div>
            </div>
            <div className="booking-passenger-details">
              <div>
                Booking Date : <b>{getDate(new Date(booking.booking.bookingTime)).formattedDate}</b>
              </div>
              <div>
                Booked By : <b>{GetUser(booking.booking.customerId)}</b>
              </div>
              <div>
                Refund Status : <b>{booking.refundStatus}</b>
              </div>
            </div>
          </div>
        ))}

        <div className='pagination' id="pagi-id">
            {(currentBookings.length > bookingsPerPage && currentPage > 1) && (
                <button onClick={() => paginate(currentPage - 1)}>Previous</button>
            )}
            {currentBookings.length > indexOfLastBooking && (
                <button onClick={() => paginate(currentPage + 1)}>Next</button>
            )}
        </div>
        
      </div>
    </div>
  );
}
