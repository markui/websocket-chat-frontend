import React from "react";
import { useState, useEffect } from "react";
// import { w3cwebsocket as W3CWebSocket } from "websocket";
import * as SendBird from "sendbird";
import ChatBox from "./Chatbox";

// const client = new W3CWebSocket("ws://127.0.0.1:8000");

var sb = new SendBird({ appId: "8EED15DE-BAB0-4B6A-A301-E697A19D313F" });

function App() {
  const [enteredChannel, setEnteredChannel] = useState(undefined);
  useEffect(() => {}, []);

  const connectUser = () => {
    console.log("connect user to sb!");
    sb.connect("12345678901", function(user, error) {
      if (error) {
        console.log(error);
        console.log(`connectUser Error: ${error}`);
        return;
      }
      // console.log(`connectedUser: ${user}`);
      console.log(user);
    });
  };

  const createChannel = () => {
    console.log("create a channel in sb!");
    sb.OpenChannel.createChannel(function(openChannel, error) {
      if (error) {
        console.log(JSON.stringify(error));
        console.log(`openChannel Error: ${error}`);
        return;
      }
      console.log(openChannel);
    });
  };

  const enterChannel = () => {
    console.log("Enter a channel in sb!");
    sb.OpenChannel.getChannel(
      "sendbird_open_channel_56952_0847e22d5b8d49f621900676494c66e46dd89cb3",
      function(openChannel, error) {
        if (error) {
          console.log(JSON.stringify(error));
          console.log(`enterChannel Error: ${error}`);
          return;
        }
        openChannel.enter(function(response, error) {
          if (error) {
            return;
          }
          console.log(
            `sendbird_open_channel_56952_0847e22d5b8d49f621900676494c66e46dd89cb3 CHANNEL ENTER SUCCESS!`
          );
          setEnteredChannel(openChannel);
        });
      }
    );
  };

  const sendMessage = () => {
    console.log("send a msg in sb channel!");
    enteredChannel.sendUserMessage("msg from Dexter!", function(
      message,
      error
    ) {
      if (error) {
        console.log(JSON.stringify(error));
        console.log(`sendUserMsg Error: ${error}`);
        return;
      }
      console.log(message);
    });
  };

  return (
    <div className="App">
      <div>Chat</div>
      <button onClick={connectUser}>Connect User</button>
      <button onClick={createChannel}>Create Channel</button>
      <button onClick={enterChannel}>Enter Channel</button>
      <button onClick={sendMessage}>Send Msg</button>
      <ChatBox />
    </div>
  );
}

export default App;
