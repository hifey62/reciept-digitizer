import fs from "fs";

export async function extractReceiptData(filePath) {
  const imageBuffer = fs.readFileSync(filePath);
  const base64Image = imageBuffer.toString("base64");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model:"qwen/qwen3.6-27b",// check Groq console for current vision model name
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract data from this receipt. Return ONLY valid JSON, no other text, in this exact shape:
{
  "vendor": string,
  "amount": number,
  "date": "YYYY-MM-DD",
  "category": string,
  "items": [{ "name": string, "price": number }]
}`,
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${base64Image}` },
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2)); // keep this for now, remove once confirmed working

  const raw = data.choices[0].message.content;
  // Remove the <think>...</think> reasoning block entirely
const withoutThinking = raw.replace(/<think>[\s\S]*?<\/think>/, "").trim();

// Pull just the JSON out from inside the ```json ... ``` fence
const jsonMatch = withoutThinking.match(/```json\s*([\s\S]*?)\s*```/);
const jsonString = jsonMatch ? jsonMatch[1] : withoutThinking;
  try {
    return JSON.parse(jsonString); // was: raw
  } catch (err) {
    throw new Error("AI returned unparseable JSON: " + jsonString); // was: raw
  }
}