import React, { useState, useEffect } from "react";
import axios from "axios";
import indigo from "../../Assets/Images/indigo.png";
import airIndia from "../../Assets/Images/airindia.png";
import vistara from "../../Assets/Images/vistara.png";
import "./GetFlight.css";
import { useNavigate } from "react-router-dom";

export default function GetFlight() {
  const [flights, setFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  var [showFlight, setShowFlight] = useState(false)
  const [currFlight, setCurrFlight] = useState({})
  const flightsPerPage = 5;

  var navigate = useNavigate();

  //Change here
  const flightOwnerId = sessionStorage.getItem("ownerId");
  //till here

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    const httpHeader = {
      headers: { 'Authorization': 'Bearer ' + token }
    }
    axios
      // change here (only api, check port no accordingly)
      .get(`https://localhost:7035/api/Flight/GetAllFlights/flightOwnerId?flightOwnerId=${flightOwnerId}`, httpHeader)
      .then(function (response) {
        setFlights(response.data);
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const getAirlineImage = (airline) => {

    if(airline)
    {
      airline = airline.toLowerCase();
    }
    
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

  function handleFlight(flight){
     setShowFlight(true);
     setCurrFlight(flight)
  }

  function handleBack(){
    setShowFlight(false)
 }

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="get-flight-div">
      {/* console.log(showFlight); */}
      {!showFlight && currentFlights.map((flight, index) => (
        <div key={index} className="flight-list-div">
          <div className="flight-list">
            <div className="airline">
              <img
                src={getAirlineImage(flight.airline)}
                className="airline-logo"
              />
              <h3>{flight.airline}</h3>
            </div>
            <div className="flight-number">
              Flight Number : <b>{flight.flightNumber}</b>
            </div>
          </div>
          <div className="other-detail-div">
            <div className="status">
              status : <b>{flight.status}</b>
            </div>
            <div className="detail-btn" onClick={() => handleFlight(flight)}>
                <b>Details</b>
            </div>
          </div>

          

        </div>
      ))}

      {!showFlight && <div className="pagination">
            {flights.length > flightsPerPage && (
              <button onClick={() => paginate(currentPage - 1)}>Previous</button>
            )}
            {flights.length > indexOfLastFlight && (
              <button onClick={() => paginate(currentPage + 1)}>Next</button>
            )}
          </div>
      }
      

      {showFlight && 
      <div className="flight-detail-view">
            <div className="flight-airline-detail">
              <div className="airline">
                <img src={getAirlineImage(currFlight.airline)} className="airline-logo"/>
                <h3>{currFlight.airline}</h3>
              </div>
              <div className="flight-number">
                Flight Number : <b>{currFlight.flightNumber} </b>
              </div>
            </div>
            <div className="seat-detail-div">
              <div className="flight-number">
                Economy Seats : <b>{currFlight.totalEconomySeats} </b>
              </div>
              <div className="flight-number">
                Business Seats : <b>{currFlight.totalBusinessSeats} </b>
              </div>
              <div className="flight-number">
                Premium Economy Seats : <b>{currFlight.totalPremiumEconomySeats} </b>
              </div>
            </div>
            <div className="price-detail-div">
              <div className="flight-number">
                Economy Seat Price : <b>{currFlight.economySeatPrice} </b>
              </div>
              <div className="flight-number">
                Business Seat Price : <b>{currFlight.businessSeatPrice} </b>
              </div>
              <div className="flight-number">
                Premium Economy Seat Price : <b>{currFlight.premiumEconomySeatPrice}  </b>
              </div>
            </div>
            <div className="detail-btn" onClick={handleBack}>Back</div>
          
      </div>}
    </div>
  );
}
