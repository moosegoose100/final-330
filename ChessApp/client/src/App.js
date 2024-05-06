import './App.css';
import './css/chessboard-1.0.0.css';
import io from 'socket.io-client';
import React, { useState } from 'react';
import Game from './game.js';

const socket = io.connect("http://localhost:3001");

// Note: The Documentation Passes A Lot Of These Functions In Line.
// To Simplify, I Created Separate Functions And Passed Thos To In Line Event Listeners
const App = () =>
{
  // useState Takes In A Variable That Will Continually Change State, And A Function To Update That State
  // See Documentation Here https://legacy.reactjs.org/docs/hooks-state.html And Here https://www.w3schools.com/react/react_usestate.asp
  // We Will Use This For Both The Player Name As Well As The Room Code
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [showGame, setShowGame] = useState(false); // Not Showing The Game By Default


  // Function To Be Called When Button Is Pressed In Order To Join A Room
  const joinRoom = () =>
  {
    // Check That The Name And Room Code Aren't Empty
    if (name !== "" && room !== "")
    {      
      // Emit The Event To The Listener On The Server Side, Passing In The Room Code As The Parameter 
      socket.emit("join", name, room);
      setShowGame(true);
    }
  }

  // Index.js Uses This Return Value As The Web Page's Inner HTML
  // For Some Reason I Have To Use className Instead Of id
  // Not Sure Why But I Learned This Here https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/2161
  return (
    <div className="container">
      {!showGame ? (
      <div className="sign-in">
        <div id="login-input">
          <h1>Name:</h1>
          <input type="text" placeholder="Player Name" onChange={(event => {setName(event.target.value);})}/>
          <br />
          <br />
          <br />
          <h1>Room Code:</h1>
          <input type="text" placeholder="Room Code" onChange={(event => {setRoom(event.target.value);})}/>
          <br />
          <br />
          <br />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      </div>
      )
      :(
      <div className="game-container">
        <Game socket={socket} name={name} room={room} />
      </div>
      )}
    </div>
  );
}

export default App;
