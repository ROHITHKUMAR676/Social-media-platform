# Social Media Platform

A full-stack social media application built with React and Node.js.

## Features

- User authentication (register/login)
- Post creation and viewing
- User profiles
- Feed

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repo-url>
   cd social-media-platform
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

4. Start MongoDB (if not running):
   ```
   mongod
   ```

5. Start the server:
   ```
   cd ../server
   npm run dev
   ```

6. Start the client (in a new terminal):
   ```
   cd client
   npm run dev
   ```

7. Open [http://localhost:5173](http://localhost:5173) in your browser.

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/posts - Get all posts
- POST /api/posts - Create a new post (auth required)

## Technologies Used

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Authentication: JWT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.