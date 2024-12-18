import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import PostComments from "../../../Components/PostComments.jsx";
import config from "../../../../config.jsx";
import './ForumDetails.css';
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

function ForumDetails() {
    const { id } = useParams();
    const [forumItem, setForumItem] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [users, setUsers] = useState({});
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const payload = JSON.parse(atob(token.split('.')[1]));
                const email = payload.sub;
                if (!email) throw new Error('Email not found in token');

                const userResponse = await fetch(`${config.apiBaseUrl}/api/User`, {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!userResponse.ok) throw new Error('Failed to fetch users');

                const users = await userResponse.json();
                const user = users.find(user => user.email === email);
                if (!user) throw new Error('User not found');

                setUserId(user.id);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchForumItem = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/api/Forum/${id}`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setForumItem(data.items[0]);

                const commentsResponse = await fetch(`${config.apiBaseUrl}/api/Comment/api/Forum/${id}/comments`);
                if (!commentsResponse.ok) throw new Error('Network response was not ok');
                const commentsData = await commentsResponse.json();
                setForumItem(prevItem => ({ ...prevItem, comments: commentsData }));

                const userResponse = await fetch(`${config.apiBaseUrl}/api/User`);
                if (!userResponse.ok) throw new Error('Network response was not ok');
                const userData = await userResponse.json();
                const userMap = userData.reduce((acc, user) => {
                    acc[user.id] = user;
                    return acc;
                }, {});
                setUsers(userMap);
            } catch (error) {
                console.error('Error fetching forum item:', error);
            }
        };

        fetchForumItem();
    }, [id]);

    const handleCommentPosted = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/api/Comment/api/Forum/${id}/comments`);
            if (!response.ok) throw new Error('Network response was not ok');
            const commentsData = await response.json();
            setForumItem(prevItem => ({ ...prevItem, comments: commentsData }));
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    if (!forumItem) return <div>Loading...</div>;

    return (
        <div className="forum-details">
            <h4>{forumItem.subject}</h4>
            <p>{forumItem.body}</p>

            <div className="more-info-container">
                <p><strong>Indlæg af:</strong> {users[forumItem.userId]?.name || 'Ukendt'}</p>
                <p><strong>Oprettet:</strong> {new Date(forumItem.createdAt).toLocaleDateString()}</p>

            </div>

            <div className="comments-section">
                <button className="show-comments-button" onClick={() => setShowComments(!showComments)}>
                    {showComments ? 'Skjul kommentarer' : 'Kommentarer'}
                </button>
                {showComments && (
                    <>
                        {forumItem.comments && forumItem.comments.length > 0 ? (
                            forumItem.comments
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((comment) => (
                                    <div key={comment.id} className="comment">
                                        <p><strong>{comment.user?.name || 'Ukendt'}:</strong> {comment.text}</p>
                                        <p><small>{new Date(comment.createdAt).toLocaleString()}</small></p>
                                    </div>
                                ))
                        ) : (
                            <p>Ingen kommentarer.</p>
                        )}
                        <PostComments forumId={forumItem.id} userId={userId} onCommentPosted={handleCommentPosted} />
                    </>
                )}
            </div>
        </div>
    );
}

ForumDetails.propTypes = {
    userId: PropTypes.number,
};

export default ForumDetails;