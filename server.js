const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const db = require('./database');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function(err) {
    if (err) {
      return res.status(500).send("Error registering user");
    }
    res.redirect('/login.html');
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      return res.status(500).send("Error logging in");
    }
    if (row && bcrypt.compareSync(password, row.password)) {
      return res.redirect('/casino/index.html');
    }
    res.status(401).send("Invalid credentials");
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
