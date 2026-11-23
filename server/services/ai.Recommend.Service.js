import Groq from "groq-sdk";

export async function getAIRecommendation(userPrompt, products) {
  const client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    const prompt = `
        Here is a list of available products:
        ${JSON.stringify(products, null, 2)}

        Based on the following user request, filter and suggest the best matching products:
        "${userPrompt}"

        Only return the matching products in JSON format as an array. Do not include any explanation.
    `;

    const message = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiResponseText = message.choices[0].message.content;

    if (!aiResponseText) {
      return { success: false, products: [] };
    }

    const cleanedText = aiResponseText
      .replace(/```json|```/g, "")
      .trim();

    let parsedProducts;
    try {
      parsedProducts = JSON.parse(cleanedText);
      if (!Array.isArray(parsedProducts)) {
        parsedProducts = [parsedProducts];
      }
    } catch (error) {
      console.log("Failed to parse Groq response:", error.message);
      return { success: false, products: [] };
    }

    return { success: true, products: parsedProducts };
  } catch (error) {
    console.log("Groq API error:", error.message);
    return { success: false, products: [] };
  }
}
