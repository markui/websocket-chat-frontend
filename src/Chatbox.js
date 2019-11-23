import React from "react";
import { useState, useEffect } from "react";

function ChatBox() {
  let ws;
  let pingInterval; //ms between PINGs
  let reconnectInterval; //ms to wait before reconnect
  let pongTimeout; //ms to wait for PONG before WS closes
  let pingHandle, pongHandle;
  let lockReconnect, forbidReconnect;

  const [enteredChannel, setEnteredChannel] = useState(undefined);

  const connect = () => {
    console.log("INFO: wschat connect!");

    ws = new WebSocket(
      "ws://127.0.0.1:8000/chat?user_id=1234567891&nickname=jakekim"
    );

    ws.onopen = event => {
      console.log("INFO: ws opened!");
      console.log(event);
    };

    ws.onmessage = event => {
      console.log("INFO: ws message!");
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "LOGIN":
          pingInterval = message.ping_interval * 1000; //ms between PINGs
          reconnectInterval = message.reconnect_interval * 1000; //ms to wait before reconnect
          pongTimeout = message.pong_timeout * 1000; //ms to wait for PONG before WS closes
          heartbeatStart();
          pingHandle = setInterval(heartbeatStart, pingInterval);
          break;
        case "PONG":
          console.log("INFO: Heartbeat(PONG) received!");
          heartbeatReset();
          break;
        default:
          break;
      }
    };

    ws.onerror = error => {
      console.log("ERROR: ws error!");
      console.log(error);
      reconnect();
    };

    ws.onclose = () => {
      console.log("INFO: Socket closed!");
      console.log("INFO: stopping heartbeat...");
      clearInterval(pingHandle);
      reconnect();
    };
  };

  useEffect(() => {
    connect();
  }, []);

  const reconnect = () => {
    if (lockReconnect || forbidReconnect) return;
    console.log("INFO: Reconnecting...");
    lockReconnect = true;
    setTimeout(() => {
      connect();
      lockReconnect = false;
    }, reconnectInterval);
  };

  const heartbeatStart = () => {
    if (forbidReconnect) return;
    const message = {
      type: "PING"
    };
    ws.send(JSON.stringify(message));
    console.log("INFO: Heartbeat(PING) sent!");
    pongHandle = setTimeout(() => {
      ws.close();
    }, pongTimeout);
  };

  const heartbeatReset = () => {
    clearTimeout(pongHandle);
  };

  const closeConnection = () => {
    forbidReconnect = true;
    ws.close();
    clearTimeout(connect);
  };

  return (
    <div className="App">
      <div>ChatBox</div>
    </div>
  );
}

export default ChatBox;
