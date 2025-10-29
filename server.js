require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, {recursive: true});

const textDir = path.join(__dirname, "texts");
if (!fs.existsSync(textDir)) fs.mkdirSync(textDir, { recursive: true });

//routes 

const pdfRoutes = require("./routes/pdfRoutes");
app.use('/api/pdf', pdfRoutes);


app.get('/health', (req, res)=> res.send("RAG backend running!!!"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>console.log(`Serving up and running on PORT -- ${PORT}`));
