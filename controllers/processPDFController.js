const fs = require("fs");
const path = require("path");
const { generateEmbedding } = require("../services/geminiService");
const { pineconeClient, indexName } = require("../services/pineconeClient");

exports.processPDFText = async (req, res) => {
  try {
    const pdfId = req.params.pdfId;
    if (!pdfId) {
      return res.status(400).json({ error: "pdfId is required" });
    }

    // Load the extracted text file
    const textPath = path.join(__dirname, "..", "texts", `${pdfId}.txt`);
    if (!fs.existsSync(textPath)) {
      return res.status(404).json({ error: "Text file not found" });
    }

    const text = fs.readFileSync(textPath, "utf-8");
    console.log("✅ Loaded text from:", textPath);

    // Split text into chunks
    const chunkSize = 1000;
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    console.log(`🧩 Split into ${chunks.length} chunks`);

    // Generate embeddings for each chunk
    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i].trim();
      if (!chunkText) continue;

      console.log(`🔹 Generating embedding for chunk ${i + 1}/${chunks.length}`);

      const embedding = await generateEmbedding(chunkText);

      if (!embedding || !Array.isArray(embedding)) {
        console.error("❌ Invalid embedding returned for chunk", i);
        continue;
      }

      vectors.push({
        id: `${pdfId}_chunk_${i}`,
        values: embedding,
        metadata: { text: chunkText, pdfId },
      });
    }

    if (vectors.length === 0) {
      return res.status(400).json({ error: "No valid chunks to upload" });
    }

    console.log(`📤 Uploading ${vectors.length} vectors to Pinecone...`);

    // Connect to the Pinecone index
    const index = pineconeClient.Index(indexName);

    // Upsert requires an array of vector objects, not { vectors: ... }
    await index.upsert(vectors);

    console.log("Embeddings successfully uploaded to Pinecone!");

    res.status(200).json({
      message: "Text processed & uploaded to Pinecone successfully",
      chunks: chunks.length,
      uploaded: vectors.length,
    });
  } catch (err) {
    console.error("❌ Error in processPDFText:", err);
    res.status(500).json({ error: "Failed to process PDF text" });
  }
};





// const fs = require("fs");
// const path = require("path");
// const { generateEmbedding } = require("../services/geminiService");
// const { pineconeClient, indexName } = require("../services/pineconeClient");


// exports.processPDFText = async (req, res) => {

//     try{

//         const pdfId = req.params.pdfId;
//         if(!pdfId) return res.status(400).json({error: "pdfId is required"});

//         const textPath = path.join(__dirname, "..", "texts", `${pdfId}.txt`);
//         if(!fs.existsSync(textPath)){
//             return res.status(404).json({error: "text file not found"});
//         }

//         const text = fs.readFileSync(textPath, "utf-8");
//         console.log("Loaded text from: ", textPath);

//         const chunkSize = 1000;
//         const chunks = [];
//         for(let i=0; i<text.length; i+=chunkSize){
//             chunks.push(text.slice(i, i+chunkSize));
//         }

//         console.log(`split into ${chunks.length} chunks`);

//         const vectors = [];

//         for(let i=0; i<chunks.length; i++){
//             const embedding = await generateEmbedding(chunks[i]);

//             vectors.push({
//                 id:`${pdfId}_chunk_${i}`,
//                 values: embedding,
//                 metadata: {text: chunks[i], pdfId},
//             });

//         }

//         const index = pineconeClient.Index(indexName);
//         await index.upsert({ vectors });

//         res.status(200).json({
//             message: "Text processed & uploaded to pinecone",
//             chunks: chunks.length,
//         });

//     }
//     catch(err){
//         console.error("Error in processsPDFText: ", err);
//         res.status(500).json({error: "Failed to process PDF text"});
//     }
// };

