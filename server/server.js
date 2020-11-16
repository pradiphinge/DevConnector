import express from 'express';

import connectDB from './config/db.js';
import usersRoute from './routes/api/users.js';
import postsRoute from './routes/api/posts.js';
import authRoute from './routes/api/auth.js';
import profilesRoute from './routes/api/profiles.js';

const app = express();

//connect Database
connectDB();

//API Home Page
app.get('/', (req, res) => {
    res.send('API is running');
})

//Define Routes
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/posts', postsRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/profiles', profilesRoute);

const PORT = process.env.PORT||5000;

app.listen(PORT,()=>console.log('server started on PORT',PORT));
