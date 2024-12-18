import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import config from "../../../../config.jsx";
import './ForumCard.css';

function ForumCard({ item, userId, users }) {
    useNavigate();
    useEffect(() => {
        if (!userId) return;

        const checkLikeStatus = async () => {
            try {
                const checkUrl = new URL(`${config.apiBaseUrl}/api/ForumLikes/${userId}`);
                const checkResponse = await fetch(checkUrl, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!checkResponse.ok) {
                    throw new Error('Network response was not ok');
                }

                const likes = await checkResponse.json();
                const likeStatus = likes.some(like => like.forumId === item.id);
            } catch (error) {
                console.error('Error checking like status:', error);
            }
        };

        checkLikeStatus();
    }, [item.id, userId]);

    const handleCardClick = () => {
        window.open(`/ForumDetails/${item.id}`, '_blank');
    };

    const userName = users[item.userId]?.name || 'Unknown User';

    return (
        <div className="forum-card" onClick={handleCardClick}>
            <div className="forum-card-content">
                <h3>{item.subject}</h3>
                <p><strong>{item.body.substring(0, 100)}{item.body.length > 100 ? '... Se mere' : ''}</strong></p>
                <p>Indlæg af: {userName}</p>
                <p>Oprettet: {new Date(item.createdAt).toLocaleString()}</p>
                <p><ThumbUpIcon/> {item.likeCount}</p>
            </div>
        </div>
    );
}

ForumCard.propTypes = {
    item: PropTypes.object.isRequired,
    userId: PropTypes.number, // Make userId optional
    users: PropTypes.object.isRequired, // Add users prop
};

export default ForumCard;