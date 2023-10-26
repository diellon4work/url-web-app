import React, { useEffect, useState } from 'react';
import './App.scss'


function App() {

  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [expirationTime, setExpirationTime] = useState(300); 
  useEffect(() => {
    const storedOriginalUrls = JSON.parse(localStorage.getItem('originalUrls'));
    if (storedOriginalUrls) {
      setShortenedUrls(storedOriginalUrls);
    }
  }, []);
  

  const generateShortUrl = (url) => {
    const hashCode = url
      .split('')
      .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
      .toString(36);

    return `http://short.link/${hashCode}`;
  };

  const handleShortenUrl = () => {
    const shortUrl = generateShortUrl(originalUrl);
    const createdAt = new Date(); 
    const newEntry = { url: shortUrl, originalUrl: originalUrl, expiration: expirationTime, createdAt };

    
    const updatedUrls = [...shortenedUrls, newEntry];
    setShortenedUrls(updatedUrls);
    localStorage.setItem('originalUrls', JSON.stringify(updatedUrls));

    setOriginalUrl(''); 
  };

  const handleDeleteUrl = (index) => {
    const updatedUrls = [...shortenedUrls];
    updatedUrls.splice(index, 1);

    
    setShortenedUrls(updatedUrls);
    localStorage.setItem('originalUrls', JSON.stringify(updatedUrls));
  };

  

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedUrls = shortenedUrls.map(entry => {
        const createdAt = new Date(entry.createdAt);
        const elapsedSeconds = Math.floor((now - createdAt) / 1000);
        const remainingMinutes = Math.max(Math.floor((entry.expiration - elapsedSeconds) / 60), 0);
        const remainingSeconds = (entry.expiration - elapsedSeconds) % 60;
        return { ...entry, remainingMinutes, remainingSeconds };
      });
      setShortenedUrls(updatedUrls);
    }, 1000);

    return () => clearInterval(interval);
  }, [shortenedUrls]);

  return (
    <div className="App">
      <div className="menuContainer">
        <img src="src\assets\logo.svg" alt="logo" />
        <h2>My shortened URLs</h2>
        <ul className="list">
        {shortenedUrls.map((entry, index) => (  
          <li className="list-item" key={index}>
            <a target='_blank' href={entry.originalUrl}>{entry.url}</a>
            <button onClick={() => handleDeleteUrl(index)} >
              <img src="src/assets/trash-can.png" alt="" />
            </button>
            <h2>{entry.remainingMinutes}:{entry.remainingSeconds}</h2>
          </li>
        ))}

        </ul>
      </div>
      <div className="contentContainer">
        <h1>URL Shortener</h1>
        <div className="inputWrapper">
          <input type="url" placeholder='Paste the URL to be shortened' 
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}/>
          <select name="time" id="time" value={expirationTime}
            onChange={(e) => setExpirationTime(e.target.value)}>
            <option value="default">
              Add expiration date
            </option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
            <option value="1800">30 minutes</option>
            <option value="3600">1 hour</option>
            <option value="18000">5 hours</option>
          </select>
        </div>
        <button onClick={handleShortenUrl} type="submit">
          Shorten URL
        </button>
      </div>
    </div>
  )
}

export default App