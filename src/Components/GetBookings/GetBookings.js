import React, { useEffect, useState } from "react";
import "./GetBookings.css";
import axios from "axios";
import indigo from "../../Assets/Images/indigo.png";
import airIndia from "../../Assets/Images/airindia.png";
import vistara from "../../Assets/Images/vistara.png";

export default function GetBookings() {
  var [bookings, setBooking] = useState([]);
  var [bookings1, setBooking1] = useState([]);
  var ownerId = sessionStorage.getItem("ownerId");
  const token = sessionStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 4;

  const role = sessionStorage.getItem("role");

  useEffect(() => {
    const httpHeader = {
      headers: { Authorization: "Bearer " + token },
    };
    axios
      .get(
        "https://localhost:7035/api/AdminDashboard/Bookings/Allbookings",
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
  }, []);

  var [users, setUsers] = useState();

  useEffect(() => {
    const httpHeader = {
      headers: { Authorization: "Bearer " + token },
    };
    axios
      .get(
        "https://localhost:7035/api/AdminDashboard/Users/AllCustomers",
        httpHeader
      )
      .then(function (response) {
        setUsers(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  function GetUser(id) {
    const User = users.find((user) => user.customerId === id);
    if (User) {
      return User.name;
    }
    return "User Not Found";
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

  function CancelBooking(bookingId, userId) {
    var RequestOptions = {
      method: 'Delete',
      headers: {
        'Content-Type': 'Application/json',
        'Authorization': 'Bearer ' + token
      },
    }
    fetch(`https://localhost:7035/api/CustomerDashboard/${userId}/bookings/${bookingId}`, RequestOptions)
      .then(response => {
        if (response.ok) {
          alert("Booking deleted successfully");
        } else {
          throw new Error('Failed to delete booking');
        }
      })
      .then(alert("Booking deleted successfully"))
      .catch((err) => {
        alert(err)
      })
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

  var currentBookings = bookings.filter((cb) => cb.schedule.flight.flightOwnerId == ownerId);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings1 = currentBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const currentBookings2 = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  
  return (
    <div className="bookings-div">
      <div className="get-bookings-div">
      {role === "flightowner"
          ? currentBookings1
              .map((booking, index) => (
                    <div key={index} className="booking-list-div">
                <div className="booking-schedule-details">
                  <div className="booking-flight-detail">
                    <img
                      src={getAirlineImage(booking.schedule.flight.airline)}
                      className="airline-logo"
                    />
                    <div>
                      <p className="-bookingflight-details">
                        {booking.schedule.flight.airline}
                      </p>
                      <p className="booking-flight-details">
                        {booking.schedule.flightNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flight-source">
                    <p className="flight-details">
                      {booking.schedule.route.sourceAirport.city}
                    </p>
                    <p className="flight-details">
                      {getDate(new Date(booking.schedule.departure)).formattedTime}
                    </p>
                  </div>
                  <p className="time-diff">
                    {getTimeDifference(
                      booking.schedule.departure,
                      booking.schedule.arrival
                    )}
                  </p>
                  <div className="flight-destination">
                    <p className="flight-details">
                      {booking.schedule.route.destinationAirport.city}
                    </p>
                    <p className="flight-details">
                      {getDate(new Date(booking.schedule.arrival)).formattedTime}
                    </p>
                  </div>

                  <div className='delete-user-btn' onClick={() => CancelBooking(booking.bookingId, booking.customerId)}>X</div>
                </div>
                <div className="booking-passenger-details">
                  <div>
                    Booking Date :{" "}
                    <b>{getDate(new Date(booking.bookingTime)).formattedDate}</b>
                  </div>
                  <div>
                    Booked By : <b>{GetUser(booking.customerId)}</b>
                  </div>
                </div>
                    </div>
              ))
          : currentBookings2.map((booking, index) => (
              <div key={index} className="booking-list-div">
                <div className="booking-schedule-details">
                  <div className="booking-flight-detail">
                    <img
                      src={getAirlineImage(
                        booking.schedule.flight.airline
                      )}
                      className="airline-logo"
                    />
                    <div>
                      <p className="-bookingflight-details">
                        {booking.schedule.flight.airline}
                      </p>
                      <p className="booking-flight-details">
                        {booking.schedule.flightNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flight-source">
                    <p className="flight-details">
                      {booking.schedule.route.sourceAirport.city}
                    </p>
                    <p className="flight-details">
                      {getDate(
                        new Date(booking.schedule.departure)
                      ).formattedTime}
                    </p>
                  </div>
                  <p className="time-diff">
                    {getTimeDifference(
                      booking.schedule.departure,
                      booking.schedule.arrival
                    )}
                  </p>
                  <div className="flight-destination">
                    <p className="flight-details">
                      {booking.schedule.route.destinationAirport.city}
                    </p>
                    <p className="flight-details">
                      {getDate(
                        new Date(booking.schedule.arrival)
                      ).formattedTime}
                    </p>
                  </div>

                  <div
                    className="delete-user-btn"
                    onClick={() =>
                      CancelBooking(booking.bookingId, booking.customerId)
                    }
                  >
                    X
                  </div>
                </div>
                <div className="booking-passenger-details">
                  <div>
                    Booking Date :{" "}
                    <b>
                      {getDate(
                        new Date(booking.bookingTime)
                      ).formattedDate}
                    </b>
                  </div>
                  <div>
                    Booked By :{" "}
                    <b>{GetUser(booking.customerId)}</b>
                  </div>
                </div>
              </div>
            ))}
        
           {role == "flightowner" ? (
               <div className='pagination'>
               {(currentBookings.length > bookingsPerPage && currentPage > 1) && (
                 <button onClick={() => paginate(currentPage - 1)}>Previous</button>
               )}
               {currentBookings.length > indexOfLastBooking && (
                 <button onClick={() => paginate(currentPage + 1)}>Next</button>
               )}
             </div>
            ) : (<div className='pagination'>
            {(bookings.length > bookingsPerPage && currentPage > 1) && (
              <button onClick={() => paginate(currentPage - 1)}>Previous</button>
            )}
            {bookings.length > indexOfLastBooking && (
              <button onClick={() => paginate(currentPage + 1)}>Next</button>
            )}
          </div>)}

      </div>
    </div>
  );
}
