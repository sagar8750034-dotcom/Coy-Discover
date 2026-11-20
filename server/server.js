
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "data.json");

const names = [
  "Aarav", "Priya", "Rohan", "Ananya", "Kabir",
  "Isha", "Aditya", "Meera", "Arjun", "Diya",
  "Vihaan", "Sara", "Reyansh", "Aanya", "Dev",
  "Kiara", "Krish", "Nisha", "Rahul", "Tara",
  "Vivaan", "Myra", "Kunal", "Riya", "Ishaan",
  "Sana", "Manav", "Aditi", "Yash", "Pooja"
];

function createInitialData() {
  return {
    profiles: names.map((name, i) => ({
      id: i + 1,
      name,
      age: 21 + (i % 6),
      photo: `https://i.pravatar.cc/400?img=${i + 1}`,
      bio: `Hey! I'm ${name}. Love exploring new places and meeting people.`,
      city: ["Gurgaon", "Delhi", "Noida", "Mumbai", "Bangalore"][i % 5],
      college: ["DU", "Amity", "IP University", "IIT Delhi"][i % 4],
      interests: ["Music", "Travel", "Movies", "Technology"].slice(0, 2 + (i % 3)),
      likesUser: [2, 5, 8, 12, 17, 23].includes(i + 1)
    })),
    swipes: [],
    matches: []
  };
}

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

if (!fs.existsSync(DB_PATH)) {
  saveDB(createInitialData());
}

app.get("/", (req, res) => {
  res.json({ message: "Coy Discover API is running!" });
});

app.get("/feed", (req, res) => {
  const db = readDB();
  const swipedIds = db.swipes.map(s => s.profileId);

  const feed = db.profiles.filter(
    profile => !swipedIds.includes(profile.id)
  );

  res.json(feed);
});

app.post("/swipe", (req, res) => {
  const { profileId, action } = req.body || {};

  if (!profileId || !["like", "pass"].includes(action)) {
    return res.status(400).json({ error: "Invalid profileId or action" });
  }

  const db = readDB();
  const profile = db.profiles.find(p => p.id === Number(profileId));

  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }

  if (db.swipes.some(s => s.profileId === profile.id)) {
    return res.status(409).json({ error: "Already swiped" });
  }

  db.swipes.push({
    profileId: profile.id,
    action,
    createdAt: new Date().toISOString()
  });

  let match = null;

  if (action === "like" && profile.likesUser) {
    match = {
      id: profile.id,
      name: profile.name,
      photo: profile.photo,
      matchedAt: new Date().toISOString()
    };

    db.matches.push(match);
  }

  saveDB(db);

  res.json({
    success: true,
    action,
    match,
    message: match ? "It's a match!" : "Swipe saved"
  });
});

app.get("/matches", (req, res) => {
  const db = readDB();
  res.json(db.matches);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
