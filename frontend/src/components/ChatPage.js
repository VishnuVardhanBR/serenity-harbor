import React, { useState, useEffect, useRef } from "react";
import "./ChatPage.css";
import InvitesList from "./InvitesList";
import { mirage } from "ldrs";
mirage.register();

const ChatPage = () => {
	const [messages, setMessages] = useState([]);
	const [userInput, setUserInput] = useState("");
	const [showInvites, setShowInvites] = useState(false);
	const inputRef = useRef(null);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [stream, setStream] = useState(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);
	// const navigate = useNavigate();
	const token = localStorage.getItem("token");

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
        recognitionRef.current.stop();
      }
    };
  
    if (isMicEnabled) {
      recognitionRef.current.start();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isMicEnabled]);
  
  const handleMicToggle = () => {
    setIsMicEnabled((prevIsMicEnabled) => {
      if (prevIsMicEnabled && recognitionRef.current) recognitionRef.current.stop();
      return !prevIsMicEnabled;
    });
  };

	const clearHistory = async () => {
		try {
			await fetch("http://localhost:8080/clear_history", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token: localStorage.getItem("token") }),
			});
		} catch (error) {
			console.error("Error:", error);
		}
	};
	useEffect(() => {
		inputRef.current.focus();
		clearHistory();
	}, []);

	const handleLogout = async () => {
		clearHistory();
		localStorage.removeItem("token");
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
  const handleSpeech = async (text,index) => {
    try {
      const response = await fetch("http://localhost:8080/api/text_to_speech", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      audioRef.current = new Audio(url);
      audioRef.current.play();
      setSpeakingMessageIndex(index);
      audioRef.current.onended = () => {
        setSpeakingMessageIndex(null);
      };
    } catch (error) {
      console.error("here is the ",error);
    }
  };

  const stopSpeaking = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setSpeakingMessageIndex(null);
  };

	return (
		<div className="chat-container main-container">
			<div className="header">
				<div>
					<button
						onClick={() => setShowInvites(!showInvites)}
						className="show-invites"
					>
						Show Invites
					</button>
					{showInvites && (
						<InvitesList token={token} onClose={() => setShowInvites(false)} />
					)}
				</div>
				<button onClick={handleLogout} className="logout-button">
					Logout
				</button>
			</div>
			<div className="message-container">
				<div className="assistant">
					<l-mirage size="60" speed="2.5" color="black"></l-mirage>
				</div>
				{messages.length === 0 ? (
					<h1 className="placeholder-text">Serenity Harbor</h1>
				) : (
					messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
              {message.sender === "assistant" && (
                <button onClick={speakingMessageIndex === index ? stopSpeaking : () => handleSpeech(message.text, index)}>
                  {speakingMessageIndex === index ? "Stop" : "Speak"}
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
