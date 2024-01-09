import "./App.css";
import gptLogo from "./assets/chatgpt.svg";
import addBtn from "./assets/add-30.png";
import msgIcon from "./assets/message.svg";
import home from "./assets/home.svg";
import saved from "./assets/bookmark.svg";
import upgrade from "./assets/rocket.svg";
import sendBtn from "./assets/send.svg";
import userIcon from "./assets/user-icon.jpg";
import gptImgLogo from "./assets/chatgptLogo.svg";
import { sendMsgToOpenAI } from "./openai";
import { useRef, useState, useEffect } from "react";

function App() {
  const msgEnd = useRef(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi, I am ChatGPT. How can I help you?",
      url: null,
      isBot: true,
    },
  ]);

  //for auto scroll, only when new message is added
  useEffect(() => {
    msgEnd.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input;
    setInput("");
    setMessages([...messages, { text, isBot: false }]);
    const [msg, url] = await sendMsgToOpenAI(input);
    setMessages([
      ...messages,
      { text, isBot: false },
      { text: msg, url: url, isBot: true },
    ]);
  };

  //when user presses enter
  const handleEnter = async (e) => {
    if (e.key === "Enter") {
      await handleSend();
    }
  };

  //when user clicks on what is programming or how to use an api
  const handleQuery = async (e) => {
    const text = e.target.value;
    console.log("e.target.value", e);
    console.log("text", text);
    //set messages first so that user can see the query, if not it will just hang and user will think that the app is not working
    setMessages([...messages, { text, isBot: false }]);
    const msg = await sendMsgToOpenAI(input);
    setMessages([
      ...messages,
      { text, isBot: false },
      { text: msg, isBot: true },
    ]);
  };

  return (
    <div className="App">
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={gptLogo} alt="Logo" className="logo" />
            <span className="brand">ChatGPT</span>
          </div>
          <button
            className="midBtn"
            onClick={() => {
              window.location.reload();
            }}
          >
            <img src={addBtn} alt="new chat" className="addBtn" />
            New Chat
          </button>
          <div className="upperSideBottom">
            <button
              className="query"
              onClick={handleQuery}
              value={"What is Programming?"}
            >
              <img src={msgIcon} alt="Query" />
              What is Programming?
            </button>
            <button
              className="query"
              onClick={handleQuery}
              value={"How to use an API?"}
            >
              <img src={msgIcon} alt="Query" />
              How to use an API ?
            </button>
          </div>
        </div>
        <div className="lowerSide">
          <div className="listItems">
            <img src={home} alt="Home" className="listItemsImg" />
            Home
          </div>
          <div className="listItems">
            <img src={saved} alt="Saved" className="listItemsImg" />
            Saved
          </div>
          <div className="listItems">
            <img src={upgrade} alt="Upgrade" className="listItemsImg" />
            Upgrade to Pro
          </div>
        </div>
      </div>

      <div className="main">
        <div className="chats">
          {messages.map((message, i) => (
            <div key={i}>
              <div className={message.isBot ? "chat bot" : "chat"}>
                <img
                  className="chatImg"
                  src={message.isBot ? gptImgLogo : userIcon}
                  alt="user"
                />
                <p className="txt">{message.text}</p>
              </div>
              {message.url && (
                <div className="chat bot">
                  <img className="resultImg" src={message.url} alt="user" />
                </div>
              )}
            </div>
          ))}
          <div ref={msgEnd} />
        </div>
        <div className="chatFooter">
          <div className="inp">
            <input
              type="text"
              placeholder="Send a message"
              value={input}
              onKeyDown={handleEnter}
              onChange={(e) => {
                setInput(e.target.value);
              }}
            />
            <button className="send" onClick={handleSend}>
              <img src={sendBtn} alt="Send" />
            </button>
          </div>
          <p>
            ChatGpt may produce inaccurate information about people, places, or
            facts. ChatGPT Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
