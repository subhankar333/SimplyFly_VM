import React, { useState } from "react";
import "./AddRoute.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function AddRoute() {
  var [sourceAirport, setSourceAirport] = useState("0");
  var [destinationAirport, setDestinationAirport] = useState("0");
  var [distance, setDistance] = useState();
  var [airports, setAirports] = useState([]);

  var routeDetail = {};

  var AddNewRoute = (e) => {
    e.preventDefault();

    if(sourceAirport === '0' && destinationAirport === '0')
    {
      toast("Select Source and Destination Airport");
      return;
    }
    else if(sourceAirport === '0')
    {
      toast("Select Source Airport");
      return;
    }
    else if(destinationAirport === '0')
    {
      toast("Select Destination Airport");
      return;
    }
    else if(sourceAirport === destinationAirport)
    {
      toast("Source and Destination Airport can't be same");
      return;
    }
    else if(!distance)
    {
      toast("Enter distance between airports");
      return;
    }
    else if(distance < 200)
    {
      toast("Distance between airports should be minimum 200 kms");
      return;
    }

    routeDetail.sourceAirportId = parseInt(sourceAirport);
    routeDetail.destinationAirportId = parseInt(destinationAirport);
    routeDetail.distance = parseFloat(distance);
    console.log(routeDetail);

    const token = sessionStorage.getItem('token');

    var RequestOption = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(routeDetail)
    }
    fetch("https://localhost:7035/api/Route/AddRoute", RequestOption)
      .then(res => res.json())
      .then(res => {
        console.log('Response:', res);
        toast('Route added successfully');
      })
      .catch(err => {
        console.error('Error:', err);
        toast('Route already present');
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
  return (
    <div className="add-route-div">
      <form className="add-route-form">
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
        <div className="distance-div">
          <label htmlFor="distance">
            <b>Enter Distance : </b>
          </label>
          <input
            type="number"
            value={distance}
            onChange={(e) => {setDistance(e.target.value);}}
            min={200}
          />
        </div>
      </form>
      <button type="button" className="add-route-btn" onClick={AddNewRoute}>
        Add Route
      </button>
      <ToastContainer />
    </div>
  );
}
