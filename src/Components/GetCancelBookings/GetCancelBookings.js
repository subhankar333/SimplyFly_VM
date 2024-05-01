import React, { useEffect, useState } from "react";
import "./GetCancelBookings.css";
import axios from "axios";
import indigo from "../../Assets/Images/indigo.png";
import airIndia from "../../Assets/Images/airindia.png";
import vistara from "../../Assets/Images/vistara.png";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


export default function GetCancelBookings() {

  var [bookings, setBooking] = useState([]);
  var ownerId = sessionStorage.getItem("ownerId");
  const token = sessionStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 4;

  const role = sessionStorage.getItem("role");
  console.log(role, ownerId);

  useEffect(() => {
    const httpHeader = {
      headers: { Authorization: "Bearer " + token },
    };
    axios
      .get(
        "https://localhost:7035/api/CustomerDashboard/GetAllCancelledBookings",
        httpHeader
      )
      .then(function (response) {
        console.log(ownerId);
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

  
  const handleRefundStatusUpdate = (cancelBookingId, newStatus) => {
    const httpHeader = {
      headers: { Authorization: "Bearer " + token },
    };

    var params = new URLSearchParams();
    params.append('cancelBookingId', cancelBookingId);
    params.append('status', newStatus);

    axios
      .put(
        `https://localhost:7035/api/FlightOwner/UpdateRefundStatus?${params.toString()}`,
        { cancelBookingId: cancelBookingId, status: newStatus },
        httpHeader
      )
      .then(function (response) {
        console.log(response.data);
        toast("Refund status updated successfully");
        // Refresh the bookings list
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
      })
      .catch(function (error) {
        console.error("Error:", error);
        toast("Error updating refund status.");
      });
  };
  
  var currentBookings = bookings.filter((cb) => cb.booking.schedule.flight.flightOwnerId == ownerId);
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings1 = currentBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const currentBookings2 = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bookings-div" id="bookings-div_1">
      <div className="get-bookings-div" id="get-bookings-div_1">
      {role === "flightowner"
          ? currentBookings1 
              .map((booking, index) => (
                <div key={index} className="booking-list-div" id="booking-list-div_1">
            <div className="booking-schedule-details">
              <div className="booking-flight-detail">
                <img
                  src={getAirlineImage(booking.booking.schedule.flight.airline)}
                  className="airline-logo"
                />
                <div>
                  <p className="-bookingflight-details">
                    {booking.booking.schedule.flight.airline}
                  </p>
                  <p className="booking-flight-details">
                    {booking.booking.schedule.flightNumber}
                  </p>
                </div>
              </div>
              <div className="flight-source">
                <p className="flight-details">
                  {booking.booking.schedule.route.sourceAirport.city}
                </p>
                <p className="flight-details">
                  {getDate(new Date(booking.booking.schedule.departure)).formattedTime}
                </p>
              </div>
              <p className="time-diff">
                {getTimeDifference(
                  booking.booking.schedule.departure,
                  booking.booking.schedule.arrival
                )}
              </p>
              <div className="flight-destination">
                <p className="flight-details">
                  {booking.booking.schedule.route.destinationAirport.city}
                </p>
                <p className="flight-details">
                  {getDate(new Date(booking.booking.schedule.arrival)).formattedTime}
                </p>
              </div>

              <div className="refund-status-container">
                <select
                  className="refund-status-select"
                  value={booking.refundStatus}
                  onChange={(e) => handleRefundStatusUpdate(booking.cancelId, e.target.value)}
                >
                  <option value="---Select---">---Select---</option>
                  <option value="Refund Issued">Refund Issued</option>
                  <option value="Cancelled">Refund Declined</option>
                </select>   
              </div>

            </div>
            <div className="booking-passenger-details">
              <div>
                Booking Date :{" "}
                <b>{getDate(new Date(booking.booking.bookingTime)).formattedDate}</b>
              </div>
              <div>
                  Status :{" "}
                <b style={{fontSize:"16px"}}>{booking.refundStatus}</b>
              </div>
              <div>
                Booked By : <b>{GetUser(booking.booking.customerId)}</b>
              </div>Ref
            </div>
          </div>
              ))
          : currentBookings2.map((booking, index) => (
            <div key={index} className="booking-list-div" id="booking-list-div_1">
            <div className="booking-schedule-details">
              <div className="booking-flight-detail">
                <img
                  src={getAirlineImage(booking.booking.schedule.flight.airline)}
                  className="airline-logo"
                />
                <div>
                  <p className="-bookingflight-details">
                    {booking.booking.schedule.flight.airline}
                  </p>
                  <p className="booking-flight-details">
                    {booking.booking.schedule.flightNumber}
                  </p>
                </div>
              </div>
              <div className="flight-source">
                <p className="flight-details">
                  {booking.booking.schedule.route.sourceAirport.city}
                </p>
                <p className="flight-details">
                  {getDate(new Date(booking.booking.schedule.departure)).formattedTime}
                </p>
              </div>
              <p className="time-diff">
                {getTimeDifference(
                  booking.booking.schedule.departure,
                  booking.booking.schedule.arrival
                )}
              </p>
              <div className="flight-destination">
                <p className="flight-details">
                  {booking.booking.schedule.route.destinationAirport.city}
                </p>
                <p className="flight-details">
                  {getDate(new Date(booking.booking.schedule.arrival)).formattedTime}
                </p>
              </div>

              

            </div>
            <div className="booking-passenger-details">
              <div>
                Booking Date :{" "}
                <b>{getDate(new Date(booking.booking.bookingTime)).formattedDate}</b>
              </div>
              <div>
                  Status :{" "}
                <b style={{fontSize:"16px"}}>{booking.refundStatus}</b>
              </div>
              <div>
                Booked By : <b>{GetUser(booking.booking.customerId)}</b>
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
      <ToastContainer />
    </div>
  );
}