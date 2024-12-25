const express = require('express');
const fs = require('fs');
const router = express.Router();
const blogsFile = './database/blogs.json';


const readBlogs = () => JSON.parse(fs.readFileSync(blogsFile, 'utf-8'));
const writeBlogs = (data) => fs.writeFileSync(blogsFile, JSON.stringify(data, null, 2));


router.post('/blog', (req, res) => {
    const { title, slug, content, tags } = req.body;

    if (!title) return res.status(400).send('Title is required');
    if (!slug) return res.status(400).send('Slug is required');
    if (!content) return res.status(400).send('Content is required');
    if (!Array.isArray(tags)) return res.status(400).send('Tags must be an array');

    const blogs = readBlogs();
    const newBlog = { id: blogs.length + 1, title, slug, content, tags, comments: [] };
    blogs.push(newBlog);
    writeBlogs(blogs);

    res.status(201).send('Blog created successfully');
});


router.get('/blog', (req, res) => {
    const blogs = readBlogs();
    res.json(blogs);
});


router.put('/blog/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const blogs = readBlogs();
    const blogIndex = blogs.findIndex(b => b.id === parseInt(id));

    if (blogIndex === -1) return res.status(404).send('Blog not found');

    const blog = blogs[blogIndex];
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (tags) blog.tags = tags;

    blogs[blogIndex] = blog;
    writeBlogs(blogs);

    res.send('Blog updated successfully');
});


router.delete('/blog/:id', (req, res) => {
    const { id } = req.params;

    let blogs = readBlogs();
    const blogIndex = blogs.findIndex(b => b.id === parseInt(id));

    if (blogIndex === -1) return res.status(404).send('Blog not found');

    blogs.splice(blogIndex, 1);
    writeBlogs(blogs);

    res.send('Blog deleted successfully');
});

module.exports = router;
