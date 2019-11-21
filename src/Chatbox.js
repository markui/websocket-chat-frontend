import React from "react";
import { useState, useEffect } from "react";

var ws;

function ChatBox() {
  const [enteredChannel, setEnteredChannel] = useState(undefined);

  const heartbeat = () => {
    const message = {
      type: "PING"
    };
    ws.send(JSON.stringify(message));
  };

  const connect = () => {
    console.log("wschat connect!");
    let heartbeatInterval; //ms between PINGs
    const reconnectInterval = 1000 * 3; //ms to wait before reconnect
    let heartbeatHandle;

    ws = new WebSocket(
      "ws://127.0.0.1:8000/chat?user_id=1234567891&nickname=jakekim"
    );
    // ws = new WebSocket(
    //   "wss://ws-8eed15de-bab0-4b6a-a301-e697a19d313f.sendbird.com/?p=JS&pv=Mozilla%2F5.0%20(Macintosh%3B%20Intel%20Mac%20OS%20X%2010_12_6)%20AppleWebKit%2F537.36%20(KHTML.%20like%20Gecko)%20Chrome%2F78.0.3904.70%20Safari%2F537.36&sv=3.0.112&ai=8EED15DE-BAB0-4B6A-A301-E697A19D313F&user_id=12345678901&access_token=null&active=1&Request-Sent-Timestamp=1574091670106"
    // );

    ws.onopen = event => {
      console.log("ws opened!");
      console.log(event);
    };

    ws.onerror = error => {
      console.log("ws error!");
      console.log(error);
    };

    ws.onmessage = event => {
      console.log("ws message!");
      const message = JSON.parse(event.data);
      if (message.type === "LOGIN") {
        heartbeat();
        console.log(message);
        heartbeatInterval = message.ping_interval * 1000; //ms between PINGs
        heartbeatHandle = setInterval(heartbeat, heartbeatInterval);
      }
    };

    ws.onclose = () => {
      console.log("INFO: Socket closed!");
      console.log("INFO: stopping heartbeat...");
      clearInterval(heartbeatHandle);
      console.log("INFO: Reconnecting...");
      setTimeout(connect, reconnectInterval);
    };
  };

  useEffect(() => {
    connect();
  }, []);

  const sendMessage = () => {
    ws.send(
      'MESG{"mentioned_users":[],"is_super":false,"req_id":"1574091689658","channel_id":295869487,"mention_type":"users","msg_id":2967067365,"translations":{},"ts":1574091739054,"data":"","channel_type":"open","scrap_id":"","request_id":"1574091689658","is_guest_msg":true,"user":{"guest_id":"12345678901","image":"https://sendbird.com/main/img/profiles/profile_11_512px.png","metadata":{},"id":180663557,"name":""},"is_removed":false,"sts":1574091739054,"message":"msg from Dexter!","channel_url":"sendbird_open_channel_56952_0847e22d5b8d49f621900676494c66e46dd89cb3","custom_type":"","is_op_msg":false}'
    );
  };

  const sendPing = () => {
    ws.send(`PING{"id":${Date.now()},"active":1,"req_id":""}`);
  };

  //   const closeConnection = () => {
  //     ws.close();
  //     clearTimeout(connect);
  //   };
  return (
    <div className="App">
      <div>ChatBox</div>
      <button onClick={sendMessage}>send message</button>
      <button onClick={sendPing}>send Ping</button>
    </div>
  );
}

export default ChatBox;
