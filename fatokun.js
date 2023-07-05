const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

const students = [
  { id: 1, username: 'student1', password: 'password1' },
  { id: 2, username: 'student2', password: 'password2' }
];

const staff = [
  { id: 1, username: 'staff1', password: 'password1' },
  { id: 2, username: 'staff2', password: 'password2' }
];

function isAuthenticated(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }
  res.redirect('/login');
}

app.get('/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="post" action="/login">
      <input type="text" name="username" placeholder="Username" required><br>
      <input type="password" name="password" placeholder="Password" required><br>
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const student = students.find(s => s.username === username && s.password === password);
  if (student) {
    req.session.authenticated = true;
    req.session.user = student;
    res.redirect('/student/dashboard');
    return;
  }
  const staffMember = staff.find(s => s.username === username && s.password === password);
  if (staffMember) {
    req.session.authenticated = true;
    req.session.user = staffMember;
    res.redirect('/staff/dashboard');
    return;
  }
  res.send('stupid man, type in the correct password');
});

app.get('/student/dashboard', isAuthenticated, (req, res) => {
  const student = req.session.user;
  res.send(`
    <h1>Welcome, ${student.username}!</h1>
    <p>Student Dashboard</p>
    <a href="/logout">Logout</a>
  `);
});

app.get('/staff/dashboard', isAuthenticated, (req, res) => {
  const staffMember = req.session.user;
  res.send(`
    <h1>Welcome, ${staffMember.username}!</h1>
    <p>Staff Dashboard</p>
    <a href="/logout">Logout</a>
  `);
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
