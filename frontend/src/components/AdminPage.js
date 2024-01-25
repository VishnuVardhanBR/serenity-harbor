import React, { useState } from 'react';
import './AdminPage.css';

const AdminPage = () => {
    const [showInviteBox, setShowInviteBox] = useState(false);
    const [username, setUsername] = useState('');
    const [popupMessage, setPopupMessage] = useState('');

    const handleInviteButtonClick = () => {
        setShowInviteBox(!showInviteBox);
    };

    const sendInvite = async () => {
        try {
            const response = await fetch('http://localhost:8080/invite_user', {
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
        <div className="admin-container">
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

            {popupMessage && <div className="popup-message">{popupMessage}</div>}
        </div>
    );
};

export default AdminPage;
