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
        <div className="invites-container main-container ">
            <div className="invites-header">
                <h1>Invitations</h1>
                <button onClick={onClose} className="btn btn-circle btn-outline"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
</button>
            </div>
            <div className="invites-list">
            {isLoading ? (
                <div className="flex flex-col gap-4 w-full">
                  <div className="skeleton h-12 w-full"></div>
                  <div className="skeleton h-12 w-full"></div>
                </div>
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
