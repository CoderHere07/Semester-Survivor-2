# 🎓 Semester Survival 2

Welcome to **Semester Survival 2**, a high-stakes MERN stack RPG where your goal is to survive 8 brutal semesters of academic warfare. Balance your GPA, manage your stress, and throw pencils at your problems (literally) to make it to graduation.

---

## 🚀 Features

- **Dynamic Gameplay**: Navigate through 8 distinct semesters with increasing difficulty.
- **Health & Stress Management**: Keep your Energy up and your Stress down. If either hits the limit, it's game over!
- **Battle System**: Engage in tactical combat with academic challenges. Use your pencil-throwing skills to succeed!
- **GPA Tracking**: Every move counts toward your final GPA. Aim for the Dean's List!
- **Interactive Logs**: Real-time feedback on your actions and their consequences.
- **Secure Authentication**: Save your progress and compete on the leaderboard.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Redux
- **Styling**: Bootstrap 5 + Custom CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Server**: Node.js + Express
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JSON Web Tokens (JWT) + Bcrypt.js
- **Communication**: Axios

---

## ⚙️ Installation & Setup

### 1. Prerequisite
Ensure you have [Node.js](https://nodejs.org/) installed. The server can use a local MongoDB instance or a cloud database on [MongoDB Atlas](https://www.mongodb.com/atlas).

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd Semester-Survival-2
```

### 3. Server Setup
```bash
cd server
npm install
```
- Create a `.env` file in the `server` folder:
```env
PORT=5001
MONGODB_URI=mongodb+srv://<db_username>:<db_password>@<cluster-host>/semester-survivor?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```
- In MongoDB Atlas, create a database user and allow your server's IP address in **Network Access**. Replace the placeholders in `MONGODB_URI` with your cluster host and database credentials; URL-encode any special characters in the password. Keep the `.env` file private and never commit it.
- You can copy `server/.env.example` as a starting point. `MONGODB_URI` is the preferred variable; the older `MONGO_URI` variable and the local MongoDB fallback remain supported.
- Start the server:
```bash
npm run dev
```

### 4. Client Setup
```bash
cd ../client
npm install
npm run dev
```
- By default, the client sends API requests to `http://localhost:5001`. If your backend runs elsewhere, create `client/.env` with `VITE_API_URL` set to the backend origin (for example, copy `client/.env.example`), then restart the Vite dev server.
- The application will be running at `http://localhost:5173`.

---

## 🎮 How to Play

1. **Register/Login**: Create an account to start your survival story.
2. **Take Actions**: Choose between Studying, Resting, or Socializing to manage your stats.
3. **Fight Back**: In the Battle Arena, use your throwing skills to defeat academic obstacles.
4. **Graduate**: Reach the end of Semester 8 with a passing GPA to win the game!

---

## 📄 License
This project is licensed under the ISC License.

---

*Made with ❤️ by Dani*
