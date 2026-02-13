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
Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

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
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
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
