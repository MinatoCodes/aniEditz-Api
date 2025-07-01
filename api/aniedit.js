require('dotenv').config();
const express = require('express');
const axios = require('axios');
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

async function fetchVideos(username) {
  try {
    const response = await axios.get(`https://api.scrapingdog.com/instagram/profile`, {
      params: {
        api_key: process.env.SCRAPINGDOG_KEY,
        username
      }
    });

    const posts = response.data.posts || [];

    // Filter only video posts if available
    const videoPosts = posts
      .filter(post => post.is_video || post.type === "video")
      .map(post => post.link);

    return videoPosts;

  } catch (error) {
    console.error(`❌ Error fetching videos for ${username}: ${error.message}`);
    return [];
  }
}

async function findRandomVideoFromAllUsers() {
  const shuffledUsernames = usernames
    .map(u => ({ u, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ u }) => u);

  for (const username of shuffledUsernames) {
    const videos = await fetchVideos(username);
    if (videos.length > 0) {
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      return { username, videoUrl: randomVideo };
    }
  }
  return null;
}

app.get("/api/randomanimeedit", async (req, res) => {
  const result = await findRandomVideoFromAllUsers();
  if (!result) {
    return res.json({ message: "No video posts found for any user." });
  }
  res.json(result);
});

app.listen(PORT, () => console.log(`✅ API running on port ${PORT}`));
                                            
