const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Set up session middleware
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Serve the static files
app.use(express.static(path.join(__dirname, 'public')));

// Authentication check middleware
const authenticationCheck = (req, res, next) => {
  // Check if the user is authenticated
  if (req.session.isAuthenticated) {
    next(); // User is authenticated, proceed to the requested page
  } else {
    res.redirect('/'); // User is not authenticated, redirect to the login page
  }
};

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', authenticationCheck, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Authentication endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Perform your authentication logic here
  if (username === 'admin' && password === 'password') {
    req.session.isAuthenticated = true; // Set the user as authenticated
    res.redirect('/dashboard'); // Redirect to the dashboard after successful authentication
  } else {
    res.redirect('/'); // Redirect back to the login page on authentication failure
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
