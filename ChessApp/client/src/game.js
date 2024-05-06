import React, { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom' // https://www.npmjs.com/package/react-scroll-to-bottom
import Chessboard from 'chessboardjs';

const Game = ({ socket, name, room }) =>
{
    // useState To Keep Track Of The Message Currently Being Typed
    const [currentMsg, setCurrentMsg] = useState("");
    const [chatLog, setChatLog] = useState([]);

    // Default Configs For Starting Chessboard
    const defaultConfigWhite = 
    {
        orientation: 'white',
        draggable: true,
        pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
        position: 'start'
    }

    const defaultConfigBlack = 
    {
        orientation: 'black',
        draggable: true,
        pieceTheme: 'img/chesspieces/wikipedia/{piece}.png',
        position: 'start'
    }

    // Configs To Keep Track Of Each Player Current Board State
    let configWhite =
    {

    }

    let configBlack =
    {

    }


    // Function To Be Called When Send Button Is Pressed, Sends The Message Out To The Other Person In The Room
    // Not Sure Why It Needs Async, But Intellisense Was Being Rude
    const sendMessage = async () =>
    {
        // Only Send A Message If It Isn't Blank
        if(currentMsg !== "")
        {
            // All The Data About The Message That Needs To Be Sent To Socket
            const messageData = 
            {
                room: room,
                sender: name,
                message: currentMsg,
                timeSent: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(), // Time The Message Was Sent
            }

            await socket.emit("sendMsg", messageData); // Reference To Servers Message Sending Function, Passing In Message Data From Client Side
            
            // Append Chat Log With New Message
            setChatLog((list) => [...list, messageData]);

            // Clear Current Message Value, Which Then Clears The Input Box
            setCurrentMsg("");
        }
    }

    // Called Whenever There Is A Change In The Socket Server
    useEffect(() =>
    {
        // Recieve Messages Only Once
        socket.off("recieveMsg").on("recieveMsg", (msgData) =>
        {
            // Append Chat Log With New Message
            setChatLog((list) => [...list, msgData]);

            // Log Message Info To Console
            console.log(msgData);

            // Connection Trigger Isn't Working Currently, So I'm Just Handling Board Updates With Messages For Now
            let board = Chessboard('gameBoard', defaultConfigWhite);
        })
 
    }, [socket]);

    return(
        <div id="chess-container">
            <div id="gameBoard" style={{ width: '800px' }}></div>
            <div id="chatbox">
                <div id="chat-header">
                    <h2>Live Chat</h2>
                </div>
                <div id="chat-body">
                    <ScrollToBottom className="msg-container">
                        {chatLog.map((messageData) =>
                            {
                                return (
                                <div class="message" id={name === messageData.sender ? "my-message" : "their-message"}>
                                    <div>
                                        <div id="text-content">
                                            <p>{messageData.message}</p>
                                        </div>
                                        <div id="message-data">
                                            <p id="sender-name">{messageData.sender}</p>
                                            <p id="send-time">{messageData.timeSent}</p>
                                        </div>
                                    </div>
                                </div>
                                );
                            })
                        }
                    </ScrollToBottom>
                </div>
                <div id="chat-footer">
                    <input id="message-input" type="text" value={currentMsg} placeholder="Message your oppenent" 
                    onChange={(event => {setCurrentMsg(event.target.value);})}
                    onKeyPress={(event) => {event.key === "Enter" && sendMessage()}}/>
                    <button id="btn-send" onClick={sendMessage}>Send</button>
                </div>
            </div>
            <script src="./chessGame.js"></script>
        </div>
    )
}

export default Game;