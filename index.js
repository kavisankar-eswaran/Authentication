const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Secret key for signing JWT tokens (should be stored securely)
const secretKey = 'your_secret_key';

// Dummy users (in a real application, these would be stored in a database)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, secretKey);
  res.json({ token });
});

// Protected route
app.get('/protected', (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify JWT token
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Token is valid, send protected data
    res.json({ message: 'Protected data', user: decoded });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
