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
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000",
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: imageUrl } },
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

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            if (!reader) throw new Error("No reader available");

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || !trimmedLine.startsWith("data: ")) continue;

                const data = trimmedLine.slice(6);
                if (data === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(content);
                  }
                } catch (e) {
                  console.error("Parse error:", e, "Data:", data);
                }
              }
            }

            // Flush any remaining buffer
            if (buffer) {
              const trimmedLine = buffer.trim();
              if (trimmedLine && trimmedLine.startsWith("data: ")) {
                const data = trimmedLine.slice(6);
                if (data !== "[DONE]") {
                  try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) {
                      controller.enqueue(content);
                    }
                  } catch (e) {
                    console.error("Parse error:", e, "Data:", data);
                  }
                }
              }
            }
          } catch (error) {
            console.error("Stream error:", error);
            controller.error(error);
          } finally {
            reader?.releaseLock();
            controller.close();
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
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
