import React, { useState, useEffect } from 'react';

import './AdminPage.css';
import { grid } from "ldrs";
grid.register();

const AdminPage = () => {
    const [showInviteBox, setShowInviteBox] = useState(false);
    const [username, setUsername] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [consumers, setConsumers] = useState([]);
    const [selectedConsumer, setSelectedConsumer] = useState(null);
    const [summaries, setSummaries] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchConsumers = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_BACKEND_HOST+'fetch_consumers_with_admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token: localStorage.getItem("token") }),
                });
                const data = await response.json();
                if (response.ok) {
                    setConsumers(data.consumer_usernames); 
                    setSelectedConsumer(data.consumer_usernames[0]);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchConsumers();
    }, []);

    useEffect(() => {
        if (selectedConsumer) {
            fetchSummaries(selectedConsumer);
        }
    }, [selectedConsumer]);

	const handleLogout = async () => {
		localStorage.removeItem("token");
		window.location.reload();
	};
    const fetchSummaries = async (consumerUsername) => {
        setLoading(true);
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_HOST+'/fetch_summaries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ consumer_username: consumerUsername, token: localStorage.getItem("token") }),
            });
            const data = await response.json();
            if (response.ok) {
                setSummaries(prev => ({ ...prev, [consumerUsername]: Object.values(data.summaries) }));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); // Adjust formatting as needed
    };
    const handleInviteButtonClick = () => {
        setShowInviteBox(!showInviteBox);
    };

    const sendInvite = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_HOST+'/invite_user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ consumer_username: username, token: localStorage.getItem("token") }),
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'An unknown error occurred');
            }

            setPopupMessage('Invite sent!');
            setUsername('');
        } catch (error) {
            setPopupMessage(error.message);
        } finally {
            setShowInviteBox(false);
            setTimeout(() => setPopupMessage(''), 3000);
        }
    };

    return (
        <div className="admin-container main-container">
            <div className="header">
				<button onClick={handleLogout} className="logout-button">
					Logout
				</button>
                <button className="invite-button" onClick={handleInviteButtonClick}>Invite User</button>
                {showInviteBox && (
                    <div className="invite-box">
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Enter username"
                        />
                        <button onClick={sendInvite}>Send Invite</button>
                    </div>
                )}
			</div>
            

            {popupMessage && <div className="popup-message">{popupMessage}</div>}
        
            <div className="chat-summaries">
                <div className="tabs">
                    {consumers.map((consumer, index) => (
                        <div 
                            key={index} 
                            className={`tab ${selectedConsumer === consumer ? 'active' : ''}`}
                            onClick={() => setSelectedConsumer(consumer)}
                        >
                            {consumer}
                        </div>
                    ))}
                </div>
                <div className="summaries-content">
                    {loading ? (
                        <div className="loading"><l-grid size="70" speed="1.5" color="#205768"></l-grid></div> 
                    ) : (
                        summaries[selectedConsumer]?.map((summaryObj, index) => (
                            <div key={index} className="summary">
                                <div className="summary-header">
                                    {selectedConsumer} Chat Summary ({formatTimestamp(summaryObj.timestamp)})
                                </div>
                                <div className="summary-text">
                                    {summaryObj.summary}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
