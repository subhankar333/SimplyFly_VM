import React from 'react'
import './RegisteredSuccessfully.css'
import greenTick from '../../Assets/Images/green-tick.jpg'
import { useNavigate } from 'react-router-dom'

export default function RegisteredSuccessfully() {
  var navigate=useNavigate()

  function home(){
    navigate('/login')
  }
  return (
    <div className='registration-body-div'>
      <div className='registration-msg-div'>
        <img src={greenTick} className='green-tick'/>
        <h3>Account Created Successfully</h3>
        <button onClick={home} className="login-here-btn">Home</button>
      </div>
    </div>
  )
}
