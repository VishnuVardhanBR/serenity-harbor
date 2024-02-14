import React, { useState, useEffect } from 'react';
import './InvitesList.css';

const InvitesList = ({ token, onClose }) => {
    const [invites, setInvites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingInvite, setProcessingInvite] = useState(null);
    useEffect(() => {
        const fetchInvites = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(process.env.REACT_APP_BACKEND_HOST+'/fetch_invites', {
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
        setProcessingInvite(username);
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_HOST+'/manage_invite', {
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
        finally{
            setProcessingInvite(null);
        }
    };

    return (
        <div className="invites-container main-container">
            <div className="invites-header">
                <h1>Invitations</h1>
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
                            <button 
                                onClick={() => handleInviteResponse(username, true)} 
                                className={`invite-button ${processingInvite === username ? 'loading' : ''}`}
                                disabled={processingInvite === username}
                            >
                                Accept
                            </button>
                            <button 
                                onClick={() => handleInviteResponse(username, false)} 
                                className={`invite-button ${processingInvite === username ? 'loading' : ''}`}
                                disabled={processingInvite === username}
                            >
                                Ignore
                            </button>
                        </div>
                    </div>
                ))
            )}
            </div>
        </div>
    );
};

export default InvitesList;
