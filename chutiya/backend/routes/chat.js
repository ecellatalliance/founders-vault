const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
// NOTE: Ensure GEMINI_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE');

router.post('/', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Filter and format history
        // Gemini requires history to start with 'user' role
        const formattedHistory = (history || [])
            .filter(msg => msg.parts && msg.parts[0].text) // Ensure valid content
            .map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user', // Map 'assistant' to 'model'
                parts: msg.parts
            }));

        // Ensure the first message is from the user
        while (formattedHistory.length > 0 && formattedHistory[0].role !== 'user') {
            formattedHistory.shift();
        }

        const chat = model.startChat({
            history: formattedHistory,
            generationConfig: {
                maxOutputTokens: 200,
            },
        });

        // System instruction injection (simulated via first message context if needed, 
        // or just relying on the persona in the prompt)
        const prompt = `You are Vaultie, the official mascot of the E-Cell (Entrepreneurship Cell). 
        You are enthusiastic, helpful, and knowledgeable about startups, business, and coding. 
        Keep your answers concise and fun. Use emojis occasionally.
        
        User: ${message}`;

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (err) {
        console.error('Gemini API Error Details:', JSON.stringify(err, null, 2));
        console.error('Error Message:', err.message);
        res.status(500).json({
            message: 'Vaultie is having trouble connecting to the brain server.',
            error: err.message
        });
    }
});

module.exports = router;
