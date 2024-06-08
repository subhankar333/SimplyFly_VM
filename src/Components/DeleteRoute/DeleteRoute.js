import React, { useState } from 'react'
import './DeleteRoute.css'

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function DeleteRoute() {
  var [sourceAirport, setSourceAirport] = useState("0");
  var [destinationAirport, setDestinationAirport] = useState("0");
  var [airports, setAirports] = useState([]);
  var routeDetail = {};

  var DeleteFlightRoute = (e) => {

    e.preventDefault();

    if(sourceAirport === '0' && destinationAirport === '0')
    {
      toast("Enter Source and Destination Airport");
      return;
    }
    else if(sourceAirport === '0')
    {
      toast("Enter Source Airport");
      return;
    }
    else if(destinationAirport === '0')
    {
      toast("Enter Destination Airport");
      return;
    }
    else if(destinationAirport === sourceAirport)
    {
      toast("Source and Destination Airport can't be same");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to remove the route?`);
    if (confirmDelete) {
     
      routeDetail.sourceAirportId = parseInt(sourceAirport);
      routeDetail.destinationAirportId = parseInt(destinationAirport);
      console.log(routeDetail);

      const token = sessionStorage.getItem('token')

      var RequestOption = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(routeDetail)
      }
      fetch("https://localhost:7035/api/Route", RequestOption)
        .then(res => res.json())
        .then(res => {
          console.log('Response:', res);
          toast('Route deleted successfully');
        })
        .catch(err => {
          console.error('Error:', err);
          toast('No Such Route available');
        });
    }

  }

  useState(() => {
    fetch("https://localhost:7035/api/Route/GetAirports")
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setAirports(res);
      });
  });

  return (
    <div className="delete-route-div">
      <form className="delete-route-form">
        <div className="source-airport-div">
          <label htmlFor="source-airport">
            <b>Source Airport : </b>
          </label>
          <select
            className="select-source-airport"
            onChange={(e) => setSourceAirport(e.target.value)}
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
            onChange={(e) => setDestinationAirport(e.target.value)}
          >
            <option value="0">--Select airport--</option>
            {airports.map((airport) => (
              <option key={airport.airportId} value={airport.airportId}>
                {airport.city}
              </option>
            ))}
          </select>
        </div>
      </form>
      <button type="button" className="delete-route-btn" onClick={DeleteFlightRoute}>
        Remove Route
      </button>
      <ToastContainer />
    </div>
  )
}
