const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Create embeddings using Gemini 1.5 models
exports.generateEmbedding = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values; // returns float array
  } catch (err) {
    console.error("Error generating embedding:", err);
    throw err;
  }
};




// const { GoogleGenerativeAIEmbeddings } = require("@google/generative-ai");

// const gemini = new GoogleGenerativeAIEmbeddings({
//     apiKey: process.env.GEMINI_API_KEY,
// });

// exports.generateEmbedding = async (text) => {
//     const result = await gemini.embedContent(text);
//     return result.data[0].embedding;
// };
