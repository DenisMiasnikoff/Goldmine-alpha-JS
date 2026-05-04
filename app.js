const mongoose=require('mongoose');
const express=require('express');
const cors=require('cors')
const userRoutes=require('./routes/userRoutes');
const dungeonRoutes = require('./routes/dungeonRoutes');
const postRoutes=require('./routes/postRoutes');
const itemRoutes=require('./routes/itemRoutes');
const app=express();


app.use(cors({
  origin: 'http://localhost:3000', // Allow your Next.js app
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false, // This handles the OPTIONS request for you!
  optionsSuccessStatus: 204
}));



app.use(express.json()); // Essential for reading req.body

app.get('/', (req, res) => {
  res.status(200).send('Hello from the Goldmine!');
});

app.use('/api/v1/users',userRoutes);
app.use('/api/v1/dungeons', dungeonRoutes);
app.use('/api/v1/posts',postRoutes);
app.use('/api/v1/items',itemRoutes);
module.exports=app;

