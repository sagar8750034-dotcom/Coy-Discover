# Coy Discover 💙

A swipe-based dating discovery application built as part of the SDE Intern assignment.

Coy Discover allows users to explore profiles, like or pass on them, and discover mutual connections through a simple and interactive interface.

## ✨ Features

- **Profile Discovery:** Browse one profile at a time.
- **Swipe Actions:** Like or pass on profiles using buttons.
- **Touch Gestures:** Swipe profiles on mobile devices.
- **Mutual Matching:** Matches are created only when both users like each other.
- **Matches View:** View all successful matches.
- **Persistent Storage:** Profile swipes and matches are saved using JSON file storage.
- **No Repeated Profiles:** Already-swiped profiles do not appear again.
- **Responsive UI:** Designed for desktop and mobile screens.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- CSS

**Backend**
- Node.js
- Express.js
- CORS

**Storage**
- JSON File Storage

## 📁 Project Structure

```text
Coy-Discover/
│
├── client/
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
│
├── server/
│   ├── data.json
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/sagar8750034-dotcom/Coy-Discover.git
cd Coy-Discover
```

### 2. Start the Backend

```bash
cd server
npm install
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 3. Start the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL provided by Vite, usually:

`http://localhost:5173`

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/feed` | Fetch available profiles |
| POST | `/swipe` | Like or pass on a profile |
| GET | `/matches` | Retrieve mutual matches |

### Swipe API Example

**POST** `/swipe`

Request Body:

```json
{
  "profileId": 2,
  "action": "like"
}
```

Possible actions:
- `like`
- `pass`

A match is created only when the selected profile has already liked the logged-in user.

## 🎯 Project Objective

The objective of this project is to build a standalone swipe-based Discover experience with profile discovery, swipe interactions, mutual matching, and persistent data storage.

## 👨‍💻 Author

**Sagar Singh**

GitHub: [sagar8750034-dotcom](https://github.com/sagar8750034-dotcom)

Project Repository: [Coy-Discover](https://github.com/sagar8750034-dotcom/Coy-Discover)