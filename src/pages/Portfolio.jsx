import React, { useState, useEffect, useContext } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import * as Icons from "../assets/Icons";


function Portfolio() {
  const [documents, setDocuments] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "portfolio")); 
        const portfolioItems = querySnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(), 
        }));
        setDocuments(portfolioItems); 
        console.log(portfolioItems)
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

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <h2>Portfolio Items</h2>
      <div>
        {documents.map((doc) => (
          <div key={doc.id} style={{ borderBottom: '1px solid #ddd', marginBottom: '20px', paddingBottom: '10px' }}>
            <h3>{doc.title}</h3>
            <p><strong>Published Date: </strong>{formatDate(doc.timestamp)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Portfolio