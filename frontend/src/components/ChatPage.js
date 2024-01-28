import React, { useState, useEffect, useRef } from "react";
import "./ChatPage.css";
import { useNavigate } from "react-router-dom";
import InvitesList from "./InvitesList";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [showInvites, setShowInvites] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [stream, setStream] = useState(null);
  const audioRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const recognitionRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new window.SpeechRecognition();
    recognitionRef.current.interimResults = true;
    recognitionRef.current.continuous = true;

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setUserInput(transcript);
    };

    recognitionRef.current.onend = () => {
      if (isMicEnabled) {
        recognitionRef.current.start();
      }
    };
  }, [isMicEnabled]);

  const handleMicToggle = () => {
    const newMicState = !isMicEnabled;
    setIsMicEnabled(newMicState);
    if (!newMicState) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    if (isMicEnabled) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setStream(stream);
          audioRef.current.srcObject = stream;
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  }, [isMicEnabled]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const sendMessageToBackend = async (message) => {
    try {
      const response = await fetch("http://localhost:8080/fetch_response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userprompt: message,
          token: localStorage.getItem("token"),
        }),
      });

      const responseData = await response.json();
      return responseData.response;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSendMessage = async (e) => {
    setUserInput("");
    e.preventDefault();
    if (userInput.trim()) {
      const newMessage = { text: userInput, sender: "user" };
      setMessages([...messages, newMessage]);

      const assistantResponse = await sendMessageToBackend(userInput);
      setMessages((prev) => [
        ...prev,
        { text: assistantResponse, sender: "assistant" },
      ]);
    }
  };

  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="chat-container">
      <div className="header">
        <div>
          <button
            onClick={() => setShowInvites(!showInvites)}
            className="show-invites"
          >
            Show Invites
          </button>
          {showInvites && <InvitesList token={token} onClose={() => setShowInvites(false)} />}
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="message-container">
        {messages.length === 0 ? (
          <h1 className="placeholder-text">Serenity Harbor</h1>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
              {message.sender === "assistant" && (
                <button onClick={isSpeaking ? stopSpeaking : () => speak(message.text)}>
                  {isSpeaking ? "Stop" : "Speak"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
      <div className="input-container">
        <button onClick={handleMicToggle}>
          {isMicEnabled ? "Disable Mic" : "Enable Mic"}
        </button>
        {isMicEnabled && <audio ref={audioRef} />}
        <form onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button style={{ color: "black", fontWeight: "bold" }} type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
