import OpenAI from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: req.body.prompt }]
    });

    return res.status(200).json({ code: completion.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}