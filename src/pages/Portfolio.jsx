import React, { useState, useEffect, useContext } from 'react';
import { db, storage } from '../config/firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../context/AuthContext'; // Assuming you have an AuthContext

function Portfolio() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [markdownContent, setMarkdownContent] = useState(''); // Markdown input
  const [imageFile, setImageFile] = useState(null);
  const [htmlContent, setHtmlContent] = useState(''); // HTML content
  const [creating, setCreating] = useState(false); // State to control form visibility
  const { currentUser } = useContext(AuthContext); // Get the logged-in user

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const portfolioItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(portfolioItems);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.toDate) {
      const date = timestamp.toDate();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Unknown Date";
  };

  const handleMarkdownChange = (event) => {
    const markdown = event.target.value;
    setMarkdownContent(markdown);
    setHtmlContent(marked(markdown)); // Convert Markdown to HTML
  };

  const handleImageUpload = async () => {
    if (!imageFile) return '';

    const storageRef = ref(storage, `images/${uuidv4()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleCreate = async () => {
    if (!title || !markdownContent) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const imageUrl = await handleImageUpload();

      const updatedMarkdownContent = imageUrl
        ? `${markdownContent}\n\n![Uploaded Image](${imageUrl})`
        : markdownContent;

      const docRef = await addDoc(collection(db, "portfolio"), {
        title,
        description,
        content: updatedMarkdownContent,
        htmlContent: marked(updatedMarkdownContent),
        timestamp: Timestamp.now(),
      });

      setDocuments([
        ...documents,
        {
          id: docRef.id,
          title,
          description,
          content: updatedMarkdownContent,
          htmlContent: marked(updatedMarkdownContent),
          timestamp: Timestamp.now(),
        },
      ]);
      setTitle('');
      setDescription('');
      setMarkdownContent('');
      setImageFile(null);
      setCreating(false);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Portfolio Items</h2>

      {/* Show "Add New Document" button only if user is logged in */}
      {currentUser && (
        <button onClick={() => setCreating(!creating)}>
          {creating ? 'Cancel' : 'Add New Document'}
        </button>
      )}

      {creating && currentUser && (
        <div>
          <h3>Create New Document</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Markdown Content:</label>
              <textarea
                value={markdownContent}
                onChange={handleMarkdownChange}
                rows="10"
                required
              />
            </div>
            <div>
              <label>Upload Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>
            <button type="submit">Create</button>
          </form>
        </div>
      )}

      <div>
        {documents.map((doc) => (
          <div key={doc.id} style={{ borderBottom: '1px solid #ddd', marginBottom: '20px', paddingBottom: '10px' }}>
            <h3>
              <Link to={`/portfolio/${doc.id}`}>{doc.title}</Link>
            </h3>
            <p><strong>Published Date: </strong>{formatDate(doc.timestamp)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Portfolio;
