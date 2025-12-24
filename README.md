# 🎮 Who Am I? - Frontend

A real-time multiplayer game where players discover which character they've been assigned through hints and interactions. Built with React, TypeScript, and Socket.IO to provide a smooth and interactive experience.

## ✨ Features

- 🎯 **Real-Time Game** - Bidirectional communication via WebSocket
- 🎨 **Modern Interface** - Responsive design with smooth GSAP animations
- 🔐 **Room System** - Create and join rooms with unique codes
- 👥 **Multiplayer** - Support for multiple simultaneous players
- 🎭 **Two Game Modes**:
  - **Preset**: Pre-defined characters by category (animals, celebrities, foods, etc.)
  - **Custom**: Players assign characters to each other
- 🛡️ **Route Protection** - Robust guard and validation system
- 💾 **Session Persistence** - Automatic reconnection on disconnection

## 🚀 Technologies

- **React 18** - UI Library
- **TypeScript** - Static typing
- **Vite** - Build tool and dev server
- **Socket.IO Client** - Real-time communication
- **React Router DOM** - Routing
- **TailwindCSS** - Styling
- **GSAP** - Animations
- **Sonner** - Toast notifications
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── components/
│   ├── game/          # Game-specific components
│   ├── layout/        # Layout and structure
│   └── ui/            # Reusable components
├── contexts/          # React contexts (Socket, Room, Player)
├── hooks/             # Custom hooks
├── pages/             # Application pages
├── routes/            # Route configuration
├── services/          # Services (Socket.IO)
├── types/             # TypeScript definitions
└── utils/             # Utilities and helpers
```

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/lc0808/whoami-frontend.git

# Enter the directory
cd whoami-frontend

# Install dependencies
npm install --legacy-peer-deps

# Configure environment variables
cp .env.example .env
```

## ⚙️ Configuration

Edit the `.env` file with the backend server URL:

```env
VITE_SOCKET_URL=http://localhost:3000
```

## 🎯 Running

```bash
# Development mode
npm run dev

# Production build
npm run build

# Build preview
npm run preview

# Type checking
npm run type-check

# Lint
npm run lint
```

## 🎮 How to Play

1. **Create Room**: Choose game mode and category (if preset)
2. **Share Code**: Send the room code to friends
3. **Wait for Players**: Minimum 2 players to start
4. **Assignment**: In custom mode, assign characters
5. **Discover**: Deduce which character you are!

## 🧩 Technical Features

- **Context API** for global state management
- **Custom Hooks** for reusable logic
- **Route Guards** for route protection
- **Session Storage** for data persistence
- **Error Boundaries** for error handling
- **TypeScript** for type safety
- **Responsive Design** mobile-first approach

## 👨‍💻 Author

**Lucas Carvalho**

- Portfolio: [under construction]
- LinkedIn: [linkedin.com/in/lucas-carvalho-32aa70227](https://linkedin.com/in/lucas-carvalho-32aa70227)
- GitHub: [@lc0808](https://github.com/lc0808)
- Email: lucasvieirac.dev@gmail.com

## 📄 License

This project was developed for educational and portfolio purposes.

---

⭐ **Built with React + TypeScript + Socket.IO**
