import React, { useState, useEffect, useRef } from "react";
import "./ChatPage.css";
import LoadingOverlay from "./LoadingOverlay"
import InvitesList from "./InvitesList";
import { leapfrog } from "ldrs";
leapfrog.register();

const ChatPage = () => {
	const [messages, setMessages] = useState([]);
	const [userInput, setUserInput] = useState("");
	const [showInvites, setShowInvites] = useState(false);
	const inputRef = useRef(null);
	const [isMicEnabled, setIsMicEnabled] = useState(false);
	// const [stream, setStream] = useState(null);
	const audioRef = useRef(null);
	const recognitionRef = useRef(null);
	const [speakingMessageIndex, setSpeakingMessageIndex] = useState(null);
	const [speakLoading, setSpeakLoading] = useState(false);
	const [assistantResponseLoading, setAssistantResponseLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	// const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const messagesEndRef = useRef(null);
	const [showHelpline, setShowHelpline] = useState(false);
	const initialPrompts = ["Welcome to Serenity Harbor. How can I support you today?"];
    const initialResponsesRef = useRef([]);
    const initialPromptIndexRef = useRef(0);
	useEffect(() => {
		window.SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;
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

	useEffect(()=>{
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages])

	const handleMicToggle = () => {
		setIsMicEnabled((prevIsMicEnabled) => {
			if (prevIsMicEnabled && recognitionRef.current)
				recognitionRef.current.stop();
			return !prevIsMicEnabled;
		});
	};

	const clearChat = async () => {
		if (messages.length === 0) {
			console.log("No messages to clear.");
			return; 
		}
		setLoading(true); 
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_HOST+"/clear_history", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token: localStorage.getItem("token") }),
            });
            if (response.ok) {
                setMessages([]); 
            }
        } catch (error) {
            console.error("Error clearing history:", error);
        }
		setLoading(false);
    };


	const handleLogout = async () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	const sendMessageToBackend = async (userInput, initialResponses) => {
		setAssistantResponseLoading(true);
		if(isMicEnabled) handleMicToggle();
		try {
			const response = await fetch(process.env.REACT_APP_BACKEND_HOST+"/fetch_response", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userprompt: userInput,
					initial_responses: initialResponses,
					token: localStorage.getItem("token"),
				}),
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const responseData = await response.json();
			setAssistantResponseLoading(false);
			return responseData.response;
		} catch (error) {
			setAssistantResponseLoading(false);
			console.error("Error:", error);
		}
	};
	

	useEffect(() => {
        // Show the first initial prompt when the component mounts
        if (initialPrompts.length > 0) {
            const firstInitialPrompt = initialPrompts[0];
            setMessages((prev) => [
                ...prev,
                { text: firstInitialPrompt, sender: "assistant" },
            ]);
        }
    }, []);

    const handleSendMessage = async (e) => {
        setUserInput("");
        e.preventDefault();
        if (userInput.trim()) {
            const newMessage = { text: userInput, sender: "user" };
            setMessages([...messages, newMessage]);

            // Store user response for the current initial prompt
            initialResponsesRef.current.push(userInput);

            // Check if there are more initial prompts to show
            if (initialPromptIndexRef.current < initialPrompts.length - 1) {
                // Show the next initial prompt
                const nextInitialPrompt = initialPrompts[initialPromptIndexRef.current + 1];
                setMessages((prev) => [
                    ...prev,
                    { text: nextInitialPrompt, sender: "assistant" },
                ]);

                // Move to the next initial prompt
                initialPromptIndexRef.current++;
            } else {
                // If all initial prompts are answered, send the data to fetch_response
                const assistantResponse = await sendMessageToBackend(userInput, initialResponsesRef.current);
                setMessages((prev) => [
                    ...prev,
                    { text: assistantResponse, sender: "assistant" },
                ]);

                // Clear initial responses and reset prompt index
                initialResponsesRef.current = [];
                // initialPromptIndexRef.current = 0;
            }
        }
    };
	const handleSpeech = async (text, index) => {
		setSpeakingMessageIndex(index);
		setSpeakLoading(true);
		try {
			const response = await fetch(process.env.REACT_APP_BACKEND_HOST+"/api/text_to_speech", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ text: text, token: token }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			audioRef.current = new Audio(url);
			audioRef.current.play();
			audioRef.current.onended = () => {
				setSpeakingMessageIndex(null);
			};
		} catch (error) {
			console.error("here is the ", error);
		}
		setSpeakLoading(false);
	};

	const stopSpeaking = () => {
		audioRef.current.pause();
		audioRef.current.currentTime = 0;
		setSpeakingMessageIndex(null);
	};

	return (
		<div className="chat-container main-container">
			{loading && <LoadingOverlay/>}
			<div className="header">
				<div className="helpline-button-container">
					<button
						className="helpline-button"
						onClick={() => setShowHelpline(!showHelpline)}
					>
						Helpline
					</button>
					{showHelpline && (
						<div className="helpline-details">
						(IASP): +00 11 22 33 44 55 
						<br />
						AASRA: +91-9820466746 
						<br />
						Sanjivani Society: +91-11-24644902 
						<br />
						Vandrevala Foundation: +91-9999 666 555
						<br />
						</div>
					)}
				</div>
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
				<button onClick={clearChat} className="clear-chat-button">
                    Start New
                </button>
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
								<>
									<br />
									<button
										className="exclude-button"
										disabled={speakLoading}
										onClick={
											speakingMessageIndex === index
												? stopSpeaking
												: () => handleSpeech(message.text, index)
										}
									>
										{speakLoading && speakingMessageIndex === index
											? <l-leapfrog size="15" speed="2.5" color="black"></l-leapfrog>
											: speakingMessageIndex === index
											? "Stop"
											: "Speak"}
									</button>
								</>
							)}
						</div>
					))
				)}
				{assistantResponseLoading && (
					<l-leapfrog size="40" speed="2.5" color="black"></l-leapfrog>
				)}
				<div ref={messagesEndRef}></div>
			</div>
			<div className="container">
				<button onClick={handleMicToggle}>
					{isMicEnabled ? "Disable Mic" : "Enable Mic"}
				</button>
				{isMicEnabled && <audio ref={audioRef} />}
				<form onSubmit={handleSendMessage} className="input-container">
					<input
						ref={inputRef}
						type="text"
						value={userInput}
						onChange={(e) => setUserInput(e.target.value)}
						placeholder="Type your message..."
					/>
					<button
						type="submit"
						disabled={assistantResponseLoading}
						style={assistantResponseLoading ? { backgroundColor: 'gray' } : null}
					>
						Send
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatPage;
