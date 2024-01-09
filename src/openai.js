import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function sendMsgToOpenAI(message) {
  const hasImage = message.toLowerCase().includes("image");
  let image = null;
  if (hasImage) {
    image = await openai.images.generate({
      model: "dall-e-3",
      prompt: message,
      response_format: "url",
      style: "natural",
    });

    message = message.replace("image", "describe");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
    max_tokens: 100, //characters
    temperature: 0.7, //number between 0 and 2, higher values make output more random, lower values make it more focused and deterministic
    frequency_penalty: 0,
    presence_penalty: 0, //Number between -2 and 2, where negative numbers encourage the model to talk about new topics, and positive numbers encourage the model to respond similarly to previous statements.
  });
  return [completion.choices[0].message.content, image?.data[0].url || null];
}
