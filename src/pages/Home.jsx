import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { marked } from 'marked';
import * as Icons from "../assets/Icons";

function Home() {
    const { currentUser } = useContext(AuthContext);
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            const docRef = doc(db, "pages", "home");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setContent(data.content);
            } else {
                console.log("No such document!");
            }
        };

        fetchContent();
    }, []);

    const handleEditClick = () => {
        setNewContent(content);
        setIsEditing(true);
    };


    const handleSaveClick = async () => {
        const docRef = doc(db, "pages", "home");

        try {
            await updateDoc(docRef, { content: newContent });
            setContent(newContent);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const handleCancelClick = () => {
        setIsEditing(false);
    };

    const getMarkdownAsHtml = (markdownText) => {
        return { __html: marked(markdownText) };
    };

    return (
        <div className='home'>
            <div className='inline'>
                {currentUser && !isEditing && (
                    <Icons.MdOutlineModeEdit className='icon' onClick={handleEditClick} />
                )}
                <h2>About me</h2>
            </div>
            {isEditing ? (
                <div>
                    <button onClick={handleSaveClick}>Save</button>
                    <button onClick={handleCancelClick}>Cancel</button>
                    <textarea
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        placeholder="Write your content here..."
                    />

                </div>
            ) : (
                <div dangerouslySetInnerHTML={getMarkdownAsHtml(content)} />
            )}
        </div>
    );
}

export default Home;
