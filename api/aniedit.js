const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;

const usernames = [
  "molob",
  "suhardfx",
  "7vv1s",
  "fxsharkk",
  "aeno.edits",
  "killua.ae",
  "zerowxz",
  "kayfxs",
  "nobitafx",
  "nexx.editz",
  "unqfx"
];

// Simple in-memory cache: { username: { timestamp, videos: [] } }
const cache = {};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in ms

async function fetchVideos(username) {
  const now = Date.now();

  // Return cache if valid
  if (cache[username] && now - cache[username].timestamp < CACHE_DURATION) {
    return cache[username].videos;
  }

  try {
    const options = {
      method: "GET",
      url: "https://instagram-scraper-api2.p.rapidapi.com/v1/profile",
      params: { username },
      headers: {
        "X-RapidAPI-Key": "79964fe645msh67fc7c7871bb265p1bfb72jsn1fd710710b56",
        "X-RapidAPI-Host": "instagram-scraper-api2.p.rapidapi.com"
      }
    };

    const response = await axios.request(options);

    const posts = response.data.data.edge_owner_to_timeline_media.edges;

    const videoUrls = posts
      .filter(post => post.node.is_video)
      .map(post => `https://www.instagram.com/p/${post.node.shortcode}/`);

    // Cache result
    cache[username] = {
      timestamp: now,
      videos: videoUrls
    };

    return videoUrls;

  } catch (error) {
    console.error(`Failed to fetch videos for ${username}`, error.message);
    return [];
  }
}

app.get("/api/aniedit", async (req, res) => {
  let username = req.query.username;

  if (username && !usernames.includes(username)) {
    return res.status(400).json({ error: "Username not in the supported list." });
  }

  // Pick random username if none provided
  if (!username) {
    username = usernames[Math.floor(Math.random() * usernames.length)];
  }

  const videos = await fetchVideos(username);

  if (videos.length === 0) {
    return res.json({ message: `No video posts found for user ${username}.` });
  }

  const randomVideo = videos[Math.floor(Math.random() * videos.length)];

  res.json({
    username,
    videoUrl: randomVideo
  });
});

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  
