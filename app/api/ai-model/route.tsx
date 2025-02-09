import { NextRequest } from "next/server";
import Constanst from "@/app/data/Constanst";

export async function POST(req: NextRequest) {
  try {
    const { model, imageUrl, prompt } = await req.json();

    const modelObj = Constanst.AiModelList.find((item) => item.name === model);
    const modelName = modelObj?.modelName ?? "deepseek/deepseek-r1:free";

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_URL,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                  },
                },
              ],
            },
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    // Get the response as ReadableStream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            if (!reader) throw new Error("No reader available");

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              // Decode the stream chunks
              const chunk = decoder.decode(value);
              const lines = chunk
                .split("\n")
                .filter((line) => line.trim() !== "");

              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const data = line.slice(6);
                  if (data === "[DONE]") continue;

                  try {
                    const parsed = JSON.parse(data);
                    const text = parsed.choices?.[0]?.delta?.content || "";
                    controller.enqueue(text);
                  } catch (e) {
                    console.error("Error parsing JSON:", e);
                  }
                }
              }
            }
          } catch (error) {
            console.error("Stream processing error:", error);
            controller.error(error);
          } finally {
            controller.close();
            reader.releaseLock();
          }
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("API route error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
