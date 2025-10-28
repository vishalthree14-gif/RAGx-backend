const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');


const { uploadPDF } = require("../controllers/pdfController");


const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, {recursive: true});

const textDir = path.join(__dirname, "..", "texts");
if (!fs.existsSync(textDir)) fs.mkdirSync(textDir, { recursive: true });

// multer config
const storage = multer.diskStorage({
    destination: (req, res, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const id = Date.now() + "-" + crypto.randomBytes(4).toString("hex");
        const ext = path.extname(file.originalname);
        cb(null, `${id}${ext}`);
    },
});



const upload = multer({
    storage,
    limits: {fileSize: 25 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        if(file.mimetype !== "application/pdf"){
            return cb(new Error("Only PDF files are allowed"));
        }
        cb(null, true);
    },
});


router.post("/upload", upload.single("pdf"), uploadPDF);

module.exports = router;
