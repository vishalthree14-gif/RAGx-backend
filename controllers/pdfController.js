const fs = require("fs");
const path = require("path");
const pdf = require("pdf");

exports.uploadPDF = async (req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({error: "No PDF file uploaded"});
        }

        const filePath = req.file.path;
        const buffer = fs.readFileSync(filePath);
        const data = await pdf(buffer);

        const id = path.basename(req.file.filename, path.extname(req.file.filename));
        const numPages = data.numPages ?? null;
        const text = data.text ?? "";

        const snippet = text.slice(0, 1000);
        const returnFullText = req.query.returnFullText === "true";
        
        res.status(200).json({
            id,
            originalName: req.file.originalname,
            filename: req.file.filename,
            numPages,
            snippet,
            fullText: returnFullText ? text : undefined,
        });

    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to process PDF"});
    }
};


