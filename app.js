const express = require('express');
const app = express();
const usersRoutes = require('./routes/users');
const blogsRoutes = require('./routes/blogs');

app.use(express.json())

app.use('/', usersRoutes);
app.use('/', blogsRoutes);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
