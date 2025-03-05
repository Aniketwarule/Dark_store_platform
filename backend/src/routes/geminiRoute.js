const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PromptTemplate } = require('@langchain/core/prompts');
const Inventory = require('../db/db');
require('dotenv').config();

// Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI('AIzaSyBzRisNmv2lm0nw1fj4Kml_t-2V_KIQtn0');

// Basic route
router.get('/', (req, res) => {
    res.send('Hello World!');
});

// Endpoint to generate text using Gemini AI
router.post('/generate', async (req, res) => {
    try {
        const inventory_data = await Inventory.find();
        // console.log(inventory_data);


        const template = `You are the best data analyst in the market, specializing in dark store management. Your task is to organize the inventory into three racks, each with three categories based on sales frequency. Each category has space for only 10 items.

**Rack Structure:**
1. **Frequently Used** (High demand, high monthly sales)
2. **Moderately Used** (Medium demand, moderate monthly sales)
3. **Least Used** (Low demand, low monthly sales)

If a category is full, excess products should be placed in sub-inventory storage.

**Inventory Data:**
{inventory_data}

Using the provided inventory data, generate an optimized allocation plan for the racks. Ensure:
- The most frequently sold items are placed first.
- Each category does not exceed 10 items.
- Items are sorted based on analysis that you have to do on the given data choose the best attributes and analysis accordingly.
- Overflow items are allocated to sub-inventory.

Provide the allocation in a structured JSON format:

\`\`\`json
{{
    "Rack 1": {{
        "Frequently Used": [...],
        "Moderately Used": [...],
        "Least Used": [...]
    }},
    "Rack 2": {{
        "Frequently Used": [...],
        "Moderately Used": [...],
        "Least Used": [...]
    }},
    "Rack 3": {{
        "Frequently Used": [...],
        "Moderately Used": [...],
        "Least Used": [...]
    }},
    "Sub Inventory": [...]
}}
\`\`\`
`;

        const prompt = new PromptTemplate({
            inputVariables: ["inventory_data"],
            template,
        });

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const formattedPrompt = await prompt.format({ inventory_data: JSON.stringify(inventory_data) });
        const result = await model.generateContent(formattedPrompt);

        const response = result.response.text(); // Extract text response

        const responseData = response; // The raw response

        // Extract JSON content from the response string
        const jsonMatch = responseData.match(/```json\n([\s\S]*?)\n```/);

        if (jsonMatch && jsonMatch[1]) {
            try {
                const extractedJson = JSON.parse(jsonMatch[1]); // Parse extracted JSON
                console.log("Extracted JSON:", extractedJson);
                res.json(extractedJson);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        } else {
            console.error("No valid JSON found in response.");
        }


        res.json({ response });
    } catch (error) {
        console.error('Error generating text:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
