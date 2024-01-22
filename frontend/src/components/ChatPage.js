import React, { useState, useEffect, useRef } from 'react';
import './ChatPage.css';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const inputRef = useRef(null);
        
    useEffect(() => {
        inputRef.current.focus();
        const clearHistory = async () => {
            try {
                await fetch('http://localhost:8080/clear_history', {
                    method: 'GET',
                });
            } catch (error) {
                console.error('Error:', error);
            }
        };
        clearHistory();
    }, []);

    const sendMessageToBackend = async (message) => {
        try {
            const response = await fetch('http://localhost:8080/fetch_response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userprompt: message }),
            });
    
            const responseData = await response.json();
            return responseData.response;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSendMessage = async (e) => {
        setUserInput('');
        e.preventDefault(); 
        if (userInput.trim()) {
            const newMessage = { text: userInput, sender: 'user' };
            setMessages([...messages, newMessage]);

            const assistantResponse = await sendMessageToBackend(userInput);
            setMessages(prev => [...prev, { text: assistantResponse, sender: 'assistant' }]);
        }
    };

    return (
        <div className="chat-container">
            <div className="message-container">
                {messages.length === 0 ? (
                    <h1 className="placeholder-text">Serenity Harbor</h1>
                ) : (
                    messages.map((message, index) => (
                        <div key={index} className={`message ${message.sender}`}>
                            {message.text}
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleSendMessage} className="input-container">
                <input 
                    ref={inputRef}
                    type="text" 
                    value={userInput} 
                    onChange={(e) => setUserInput(e.target.value)} 
                    placeholder="Type your message..."
                />
                <button style={{'color': 'black', fontWeight: 'bold'}} type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatPage;