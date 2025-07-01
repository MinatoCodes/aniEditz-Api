const express = require("express");
const fetch = require("node-fetch"); // npm i node-fetch@2

const app = express();

const apiKey = "6864302867e15daf6b60779c";
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

app.get("/api/random-video", async (req, res) => {
  try {
    // Pick random username
    const username = usernames[Math.floor(Math.random() * usernames.length)];

    // Call scrapingdog API for this username
    const url = `https://api.scrapingdog.com/instagram/profile?api_key=${apiKey}&username=${username}`;
    const response = await fetch(url);
    const data = await response.json();

    // Check if data and videos exist
    const videos = data.owner_to_timeline_media?.media?.filter(m => m.is_video);

    if (!videos || videos.length === 0) {
      return res.status(404).json({
        error: "No videos found for this user",
        username
      });
    }

    // Pick random video
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];

    // Extract video URL
    const videoUrl = randomVideo.video_url || randomVideo.display_url || null;

    if (!videoUrl) {
      return res.status(404).json({
        error: "Video URL not found in selected media",
        username
      });
    }

    // Return username and video URL
    res.json({
      username,
      video_url: videoUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  
