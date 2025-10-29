const { Pinecone } = require("@pinecone-database/pinecone");

const pineconeClient = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

const indexName = "rag-embeddings";

module.exports = { pineconeClient, indexName };

