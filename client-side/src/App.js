import "./App.css";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { v4 as uuid } from "uuid";

const CryptoJS = require("crypto-js");
const sharedKey = "nonce2244";

const encryptText = (msg) => CryptoJS.AES.encrypt(msg, sharedKey).toString();

const decryptText = (msg) => {
  const bytes = CryptoJS.AES.decrypt(msg, sharedKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const socket = io.connect("http://localhost:8080");
const userName = uuid();

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendChat = () => {
    let msg = encryptText(message);
    socket.emit("chat", { message: msg, userName });
    setMessage("");
  };

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload]);
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>Secret-Chat</h1>
        {chat &&
          chat.map((el, i) => {
            return (
              <p key={i}>
                <span>{el.userName}</span>: {decryptText(el.message)}
              </p>
            );
          })}
        <div>
          <input
            type="text"
            name="chat"
            placeholder="send message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendChat}>Send</button>
        </div>
      </header>
    </div>
  );
}

export default App;