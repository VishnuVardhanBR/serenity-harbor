import React, { useState, useEffect } from 'react';
import './InvitesList.css';

const InvitesList = ({ token, onClose }) => {
    const [invites, setInvites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInvites = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/fetch_invites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch invites');
                }

                const data = await response.json();
                setInvites(data.admin_usernames);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvites();
    }, [token]);

    const handleInviteResponse = async (username, accepted) => {
        try {
            const response = await fetch('http://localhost:8080/manage_invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, username, accepted }),
            });

            if (response.ok) {
                setInvites(prev => prev.filter(inv => inv !== username));
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="invites-container">
            <div className="invites-header">
                <h2>Invitations</h2>
                <button onClick={onClose} className="close-button">X</button>
            </div>
            <div className="invites-list">
            {isLoading ? (
                <div>Loading...</div>
            ) : invites.length === 0 ? (
                <div>No invites</div>
            ) : (
                invites.map((username, index) => (
                    <div key={index} className="invite">
                        <span>{username}</span>
                        <div>
                            <button onClick={() => handleInviteResponse(username, true)} className="invite-button">Accept</button>
                            <button onClick={() => handleInviteResponse(username, false)} className="invite-button">Ignore</button>
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>
    );
};

export default InvitesList;
