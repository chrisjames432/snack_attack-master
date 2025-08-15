# Snack Attack Game

A 3D game built with Three.js and served with Node.js/Express.

## Setup and Running

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation
1. Open a terminal in the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server
Start the development server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

The game will be available at: http://localhost:3000

### Project Structure
```
snack_attack-master/
├── public/           # Static files served by the web server
│   ├── index.html   # Main game page
│   ├── maincss.css  # Game styles
│   └── js/          # JavaScript files and game assets
├── server.js        # Express server configuration
├── package.json     # Node.js project configuration
└── README.md        # This file
```

### Features
- Express.js server for serving static files
- Automatic serving of the game from the public directory
- Development-friendly setup with nodemon for auto-restart
- Clean project structure for easy maintenance

### Development
- Main game logic is in `public/js/game.js`
- Styles are in `public/maincss.css`
- The server serves all files from the `public` directory as static assets
