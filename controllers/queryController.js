const { pineconeClient, indexName } = require("../services/pineconeClient");
const { generateEmbedding } = require("../services/geminiService");

exports.queryText = async (req, res) => {
    try{
        const { query } = req.body;
        if(!query){
            return res.status(400).json({error: "Query text is required.."});
        }

        const queryEmbedding = await generateEmbedding(query);

        const index = pineconeClient.Index(indexName);

        const response = await index.query({
            vector: queryEmbedding,
            topK: 5,
            includeMetadata: true
        });

        const matches = response.matches.map((match)=>({
            id: match.id,
            score: match.score,
            text: match.metadata?.text,
            pdfId: match.metadata?.pdfId,
        }));

        res.status(200).json({
            query,
            topK: matches.length,
            results: matches,
        });

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to query Pinecone"});
    }
};
