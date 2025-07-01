const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const port = process.env.PORT || 3000;

const SCRAPER_API_KEY = "97bec7e8c380408e8e39d1b3d89a57f2";

// Updated username list
const usernames = [
  "molob",
  "killua.ae",
  "flocki__official",
  "demon_avee",
  "demonxxp4u",
  "deadeyes.exe",
  "eray._aep",
  "hamude.q",
  "satumb.amv",
  "shrey._.ae",
  "rahox_edit",
  "west_ttv",
  "f1ame_am"
];

// Function to select a random username
function getRandomUsername() {
  const randomIndex = Math.floor(Math.random() * usernames.length);
  return usernames[randomIndex];
}

app.get("/api/aniedit", async (req, res) => {
  const username = getRandomUsername();
  const targetUrl = `https://www.instagram.com/${username}/`;
  const apiUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(targetUrl)}`;

  try {
    const response = await axios.get(apiUrl);
    const $ = cheerio.load(response.data);

    // Extract JSON embedded in the page (window._sharedData)
    const scriptTag = $('script[type="application/ld+json"]').html();

    let mediaUrls = [];

    // Fallback if no structured ld+json, try parsing window._sharedData
    $('script').each((i, el) => {
      const html = $(el).html();
      if (html.includes("window._sharedData")) {
        const jsonText = html.split("window._sharedData = ")[1].split(";</script>")[0];
        const json = JSON.parse(jsonText);
        const edges = json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
        mediaUrls = edges.map(edge => `https://www.instagram.com/p/${edge.node.shortcode}/`);
      }
    });

    if (mediaUrls.length === 0) {
      return res.json({
        success: false,
        message: "No media found"
      });
    }

    // Select a random post
    const randomPost = mediaUrls[Math.floor(Math.random() * mediaUrls.length)];

    res.json({
      success: true,
      username: username,
      randomPost: randomPost
    });

  } catch (error) {
    console.error("Error scraping profile:", error);
    res.status(500).json({
      success: false,
      error: "Failed to scrape profile"
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
    
