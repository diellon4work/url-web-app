import React, { useState } from 'react';

function UrlShortener() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const generateShortUrl = (url) => {
    const hashCode = url
      .split('')
      .reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
      .toString(36);

    return `http://short.ly/${hashCode}`;
    };
}
const handleShortenUrl = () => {
  const shortUrl = generateShortUrl(originalUrl);
  setShortenedUrl(shortUrl);
};