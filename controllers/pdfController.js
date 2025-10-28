const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");


const textDir = path.join(__dirname, "..", "texts");
if (!fs.existsSync(textDir)) fs.mkdirSync(textDir, { recursive: true });


exports.uploadPDF = async (req, res) => {
  try {

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    console.log("File received:", req.file.originalname);

    const filePath = req.file.path;
    console.log("Reading file from path:", filePath);

    const buffer = fs.readFileSync(filePath);
    console.log("File read into buffer, size:", buffer.length, "bytes");

    // Parse PDF using pdf-parse v1
    const data = await pdfParse(buffer);
    console.log("PDF parsed successfully");

    const id = path.basename(req.file.filename, path.extname(req.file.filename));
    const numPages = data.numpages ?? null; // note: lowercase in pdf-parse
    const text = data.text ?? "";

    console.log("Number of pages:", numPages);
    console.log("First 200 characters of text:", text.slice(0, 200));



    //saving the text in the file

    const textFilePath = path.join(textDir, `${id}.txt`);
    fs.writeFileSync(textFilePath, text, "utf-8");
    console.log("Saved PDF text to file:", textFilePath);



    const snippet = text.slice(0, 1000);

    res.status(200).json({
      id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      numPages,
      snippet
    });

  } catch (err) {
    console.error("Error in uploadPDF:", err);
    res.status(500).json({ error: "Failed to process PDF" });
  }
};

