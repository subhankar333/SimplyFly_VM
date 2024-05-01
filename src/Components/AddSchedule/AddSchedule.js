import React, { useState } from "react";
import "./AddSchedule.css";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function AddSchedule() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const minDateTime = currentDate.toISOString().slice(0, 16);

  var [sourceAirport, setSourceAirport] = useState();
  var [destinationAirport, setDestinationAirport] = useState();
  var [flightNumber, setFlightNumber] = useState();
  var [departureTime, setDepartureTime] = useState();
  var [arrivalTime, setArrivalTime] = useState();
  var [routeId, setRouteId] = useState();
  var [airports, setAirports] = useState([]);
  var addScheduleDetails = {};

  var [flights, setFlights] = useState([]);

  useState(() => {
    const token = sessionStorage.getItem("token");
    const httpHeader = {
      headers: { Authorization: "Bearer " + token },
    };
    axios
      .get("https://localhost:7035/api/Flight", httpHeader)
      .then(function (response) {
        setFlights(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  var AddNewSchedule = (e) => {
    if (flightNumber === "0") {
      toast("Select flight number");
      return;
    }
    if (departureTime === arrivalTime) {
      toast("departure and arrival time cannot be same");
      return;
    }
    e.preventDefault();
    addScheduleDetails.flightNumber = flightNumber;
    departureTime = new Date(departureTime).toISOString();
    addScheduleDetails.departure = departureTime;
    arrivalTime = new Date(arrivalTime).toISOString();
    addScheduleDetails.arrival = arrivalTime;
    console.log(addScheduleDetails);

    const token = sessionStorage.getItem("token");

    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token
      },
    };
    const params = new URLSearchParams({
      SourceAirportId: parseInt(sourceAirport),
      DestinationAirportId: parseInt(destinationAirport),
    });
    fetch(
      `https://localhost:7035/api/Route/GetRouteById?${params.toString()}`,
      requestOptions
    )
      .then((res) => res.json())
      .then((res) => {
        console.log("here")
        addScheduleDetails.routeId = res;
        console.log(addScheduleDetails);
        var RequestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(addScheduleDetails),
        };
        fetch("https://localhost:7035/api/Schedule", RequestOptions)
          .then((res) => res.json())
          .then((res) => {
            console.log("Response:", res);
            toast("Schedule added successfully");
          })
          .catch((err) => {
            console.error("Error:", err);
            toast("Error adding schedule.");
          });
      })
      .catch((err) => {
        alert("No route found for this cities, add route first.")
      });
  };

  useState(() => {
    fetch("https://localhost:7035/api/Route/GetAirports")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setAirports(res);
      });
  });

  const handleFlightNumberChange = (e) => {
    setFlightNumber(e.target.value);
  };
  const handleSourceAirportChange = (e) => {
    setSourceAirport(e.target.value);
  };
  const handleDestinationAirportChange = (e) => {
    setDestinationAirport(e.target.value);
  };
  const handleDepartureTimeChange = (e) => {
    setDepartureTime(e.target.value);
  };
  const handleArrivalTimeChange = (e) => {
    setArrivalTime(e.target.value);
  };


  return (
    <div className="add-schedule-div">
      <form className="add-schedule-form">
        <div className="source-airport-div">
          <label htmlFor="source-airport">
            <b>Source Airport : </b>
          </label>
          <select
            className="select-source-airport"
            onChange={handleSourceAirportChange}
          >
            <option value="0">--Select airport--</option>
            {airports.map((airport) => (
              <option key={airport.airportId} value={airport.airportId}>
                {airport.city}
              </option>
            ))}
          </select>
        </div>

        <div className="destination-airport-div">
          <label htmlFor="destination-airport">
            <b>Destination Airport : </b>
          </label>
          <select
            className="select-destination-airport"
            onChange={handleDestinationAirportChange}
          >
            <option value="0">--Select airport--</option>
            {airports.map((airport) => (
              <option key={airport.airportId} value={airport.airportId}>
                {airport.city}
              </option>
            ))}
          </select>
        </div>
        <div className="flight-number-div flight-detail-div">
          <label htmlFor="flight-number">
            <b>Flight Number : </b>
          </label>
          <select
            className="select-destination-airport"
            onChange={handleFlightNumberChange}
          >
            <option value="0">--Select flight--</option>
            {flights.map((flight) => (
              <option key={flight.flightNumber} value={flight.flightNumber}>
                {flight.flightNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="departure-time-div">
          <label htmlFor="departure-time">
            <b>Departure Time : </b>
          </label>
          <input
            type="datetime-local"
            value={departureTime}
            onChange={handleDepartureTimeChange}
            min={minDateTime}
          />
        </div>

        <div className="departure-time-div">
          <label htmlFor="departure-time">
            <b>Arrival Time :</b>
          </label>
          <input
            type="datetime-local"
            value={arrivalTime}
            onChange={handleArrivalTimeChange}
            min={minDateTime}
          />
        </div>
      </form>
      <button
        type="button"
        className="add-schedule-btn"
        onClick={AddNewSchedule}
      >
        Add Schedule
      </button>
      <ToastContainer />
    </div>
  );
}
