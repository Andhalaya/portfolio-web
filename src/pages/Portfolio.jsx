import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Portfolio() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { currentUser } = useContext(AuthContext);
  const [creating, setCreating] = useState(false); // State to control form visibility

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio"));
        const portfolioItems = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocuments(portfolioItems);
        console.log(currentUser);
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

  const handleCreate = async () => {
    if (!title || !description) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "portfolio"), {
        title,
        description,
        timestamp: Timestamp.now(), // Add the current timestamp
      });

      // Update the state with the new document
      setDocuments([
        ...documents,
        {
          id: docRef.id,
          title,
          description,
          timestamp: Timestamp.now(),
        },
      ]);
      setTitle('');
      setDescription('');
      setCreating(false); // Close the form
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
      {currentUser && (
        <>
          <button onClick={() => setCreating(!creating)}>
            {creating ? 'Cancel' : 'Add New Document'}
          </button>
          {creating && (
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
                  <label>Description:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Create</button>
              </form>
            </div>
          )}
        </>
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
