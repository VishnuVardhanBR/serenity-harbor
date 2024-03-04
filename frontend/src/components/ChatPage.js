import React, { useState, useEffect, useRef } from "react";
import "./ChatPage.css";
import LoadingOverlay from "./LoadingOverlay";
import InvitesList from "./InvitesList";
import { useNavigate } from "react-router-dom";
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
	const [assistantResponseLoading, setAssistantResponseLoading] =
		useState(false);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const messagesEndRef = useRef(null);
	const [showHelpline, setShowHelpline] = useState(false);
	const initialPrompts = [
		"Welcome to Serenity Harbor. How can I support you today?",
	];
	const initialResponsesRef = useRef([]);
	const initialPromptIndexRef = useRef(0);
	const [isFirefox, setIsFirefox] = useState(false);
	useEffect(() => {
		setIsFirefox(typeof InstallTrigger !== 'undefined');

		if (!isFirefox && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
			window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			recognitionRef.current = new window.SpeechRecognition();
			recognitionRef.current.interimResults = true;
			recognitionRef.current.continuous = true;
		} else {
			console.error('Speech recognition is not supported in this browser.');
			return;
		}

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
	}, [isMicEnabled, isFirefox]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

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
			const response = await fetch(
				process.env.REACT_APP_BACKEND_HOST + "/clear_history",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ token: localStorage.getItem("token") }),
				}
			);
			if (response.ok) {
				setMessages([]);
			}
		} catch (error) {
			console.error("Error clearing history:", error);
		}
		setLoading(false);
	};

	// const handleLogout = async () => {
	// 	localStorage.removeItem("token");
	// 	window.location.reload();
	// };

	const sendMessageToBackend = async (userInput, initialResponses) => {
		setAssistantResponseLoading(true);
		if (isMicEnabled) handleMicToggle();
		try {
			const response = await fetch(
				process.env.REACT_APP_BACKEND_HOST + "/fetch_response",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userprompt: userInput,
						initial_responses: initialResponses,
						token: localStorage.getItem("token"),
					}),
				}
			);
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
		if (userInput.trim()) {
			const newMessage = { text: userInput, sender: "user" };
			setMessages([...messages, newMessage]);

			// Store user response for the current initial prompt
			initialResponsesRef.current.push(userInput);

			// Check if there are more initial prompts to show
			if (initialPromptIndexRef.current < initialPrompts.length - 1) {
				// Show the next initial prompt
				const nextInitialPrompt =
					initialPrompts[initialPromptIndexRef.current + 1];
				setMessages((prev) => [
					...prev,
					{ text: nextInitialPrompt, sender: "assistant" },
				]);

				// Move to the next initial prompt
				initialPromptIndexRef.current++;
			} else {
				// If all initial prompts are answered, send the data to fetch_response
				const assistantResponse = await sendMessageToBackend(
					userInput,
					initialResponsesRef.current
				);
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
			const response = await fetch(
				process.env.REACT_APP_BACKEND_HOST + "/api/text_to_speech",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: text, token: token }),
				}
			);

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
		<div className="h-full flex flex-col">
			{loading && <LoadingOverlay />}
			<div className="header">
				<button className="btn btn-circle mr-2" onClick={() => navigate("/dashboard")}>
					<svg viewBox="0 0 1024 1024" className="icon h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M224 480h640a32 32 0 110 64H224a32 32 0 010-64z"></path><path fill="#000000" d="M237.248 512l265.408 265.344a32 32 0 01-45.312 45.312l-288-288a32 32 0 010-45.312l288-288a32 32 0 1145.312 45.312L237.248 512z"></path></g></svg>
				</button>
				<div className="helpline-button-container">
					<button
						className="btn mr-1 btn-info"
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
						className="btn mr-1"
					>
						Show Invites
					</button>
					{showInvites && (
						<InvitesList token={token} onClose={() => setShowInvites(false)} />
					)}
				</div>
				<button onClick={clearChat} className="btn mr-1">
					Start New
				</button>
				{/* <button onClick={handleLogout} className="btn">
					Logout
				</button> */}
			</div>
			<div className="message-container flex-1 overflow-auto">
				{messages.length === 0 ? (
					<h1 className="placeholder-text">Serenity Harbor</h1>
				) : (
					messages.map((message, index) => (
						<div
							className={`chat ${message.sender === "user" ? "chat-end" : "chat-start"
								}`}
							key={index}
						>
							<div className="chat-bubble">
								{message.text}
								{message.sender === "assistant" &&
									(speakLoading && speakingMessageIndex === index ? (
										<div className="btn btn-xs ml-2 skeleton">Speak</div>
									) : (
										<button
											className="btn btn-xs ml-2"
											disabled={speakLoading}
											onClick={() =>
												speakLoading
													? stopSpeaking()
													: handleSpeech(message.text, index)
											}
										>
											{speakingMessageIndex === index ? "Stop" : "Speak"}
										</button>
									))}
							</div>
						</div>
					))
				)}
				{assistantResponseLoading && (
					<div className="ml-2 loading loading-dots loading-sm"></div>
				)}
				<div ref={messagesEndRef}></div>
			</div>
			<div className="flex p-3">
				{!isFirefox && (
					<>
						<button onClick={handleMicToggle} className="btn-circle flex-none p-3">
							{isMicEnabled ? <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 1C9.79086 1 8 2.79086 8 5V12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12V5C16 2.79086 14.2091 1 12 1ZM10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5V12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12V5Z" fill="#000000"></path> <path d="M5 9C5.55228 9 6 9.44771 6 10V12C6 13.5913 6.63214 15.1174 7.75736 16.2426C8.88258 17.3679 10.4087 18 12 18C13.5913 18 15.1174 17.3679 16.2426 16.2426C17.3679 15.1174 18 13.5913 18 12V10C18 9.44771 18.4477 9 19 9C19.5523 9 20 9.44771 20 10V12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.3938 18.9199 14.7518 19.717 12.9981 19.9375C12.9993 19.9582 13 19.979 13 20V22C13 22.5523 12.5523 23 12 23C11.4477 23 11 22.5523 11 22V20C11 19.979 11.0006 19.9582 11.0019 19.9375C9.2482 19.717 7.60623 18.9199 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12V10C4 9.44771 4.44772 9 5 9Z" fill="#000000"></path> </g></svg> : <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clipPath="url(#clip0_1348_125844)"> <path fillRule="evenodd" clipRule="evenodd" d="M16 9.41421L23.7071 1.70711C24.0976 1.31658 24.0976 0.683417 23.7071 0.292893C23.3166 -0.0976311 22.6834 -0.0976311 22.2929 0.292893L0.292893 22.2929C-0.0976311 22.6834 -0.0976311 23.3166 0.292893 23.7071C0.683417 24.0976 1.31658 24.0976 1.70711 23.7071L7.0946 18.3196C8.2281 19.1995 9.57818 19.7585 11.0019 19.9375C11.0007 19.9582 11 19.979 11 20V22C11 22.5523 11.4477 23 12 23C12.5523 23 13 22.5523 13 22V20C13 19.979 12.9993 19.9582 12.9981 19.9375C14.7518 19.717 16.3938 18.9199 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12V10C20 9.44771 19.5523 9 19 9C18.4477 9 18 9.44771 18 10V12C18 13.5913 17.3679 15.1174 16.2426 16.2426C15.1174 17.3679 13.5913 18 12 18C10.746 18 9.53253 17.6075 8.52379 16.8904L9.96817 15.446C10.5637 15.7978 11.2589 16 12 16C14.2091 16 16 14.2091 16 12V9.41421ZM14 11.4142L11.4818 13.9324C11.6469 13.9765 11.8206 14 12 14C13.1046 14 14 13.1046 14 12V11.4142Z" fill="#000000"></path> <path d="M8 5C8 2.79086 9.79086 1 12 1C13.983 1 15.6272 2.44198 15.9447 4.33454C16.0361 4.87922 15.6686 5.39484 15.124 5.48622C14.5793 5.5776 14.0637 5.21013 13.9723 4.66546C13.8137 3.72031 12.99 3 12 3C10.8954 3 10 3.89543 10 5V10.5C10 11.0523 9.55229 11.5 9 11.5C8.44771 11.5 8 11.0523 8 10.5V5Z" fill="#000000"></path> <path d="M6 10C6 9.44771 5.55228 9 5 9C4.44772 9 4 9.44771 4 10V12C4 12.7811 4.11424 13.5505 4.33348 14.2857C4.49129 14.815 5.04827 15.1161 5.57752 14.9583C6.10678 14.8005 6.4079 14.2435 6.25009 13.7143C6.08568 13.1629 6 12.5859 6 12V10Z" fill="#000000"></path> </g> <defs> <clipPath id="clip0_1348_125844"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>}
						</button>
						{isMicEnabled && <audio ref={audioRef} />}
					</>
				)}
				<input
					ref={inputRef}
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleSendMessage();
					}}
					type="text"
					placeholder="Type your message..."
					className="input flex-1 w-64"
				/>
				<button
					onClick={handleSendMessage}
					disabled={assistantResponseLoading}
					className="btn-circle flex-none p-2"
				>
					<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
				</button>
			</div>

		</div>
	);
};

export default ChatPage;
