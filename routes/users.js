const express = require('express');
const fs = require('fs');
const router = express.Router();
const usersFile = './database/users.json';


const readUsers = () => JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
const writeUsers = (data) => fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));


router.post('/register', (req, res) => {
    const { username, password, fullName, age, email, gender } = req.body;

    if (!username || username.length < 3) return res.status(400).send('Invalid username');
    if (!password || password.length < 5) return res.status(400).send('Invalid password');
    if (fullName && fullName.length < 10) return res.status(400).send('Invalid fullName');
    if (!age || age < 10) return res.status(400).send('Invalid age');
    if (!email || !email.includes('@')) return res.status(400).send('Invalid email');
    if (gender && !['male', 'female'].includes(gender)) return res.status(400).send('Invalid gender');

    const users = readUsers();
    if (users.find(user => user.username === username)) return res.status(400).send('Username already exists');

    const newUser = { id: users.length + 1, username, password, fullName, age, email, gender };
    users.push(newUser);
    writeUsers(users);

    res.status(201).send('User registered successfully');
});

router.post('/login', (req, res) => {
    const { username, email, password } = req.body;

    const users = readUsers();
    const user = users.find(u => (u.username === username || u.email === email) && u.password === password);

    if (!user) return res.status(401).send('Invalid credentials');
    res.send(`Welcome, ${user.username}`);
});


router.get('/profile/:identifier', (req, res) => {
    const { identifier } = req.params;

    const users = readUsers();
    const user = users.find(u => u.username === identifier || u.email === identifier);

    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

router.put('/profile/:identifier', (req, res) => {
    const { identifier } = req.params;
    const { fullName, age, email, gender } = req.body;

    const users = readUsers();
    const userIndex = users.findIndex(u => u.username === identifier || u.email === identifier);

    if (userIndex === -1) return res.status(404).send('User not found');

    const user = users[userIndex];
    if (fullName) user.fullName = fullName;
    if (age) user.age = age;
    if (email) user.email = email;
    if (gender) user.gender = gender;

    users[userIndex] = user;
    writeUsers(users);

    res.send('Profile updated successfully');
});


router.delete('/profile/:identifier', (req, res) => {
    const { identifier } = req.params;

    let users = readUsers();
    const userIndex = users.findIndex(u => u.username === identifier || u.email === identifier);

    if (userIndex === -1) return res.status(404).send('User not found');

    users.splice(userIndex, 1);
    writeUsers(users);

    res.send('Profile deleted successfully');
});

module.exports = router;
