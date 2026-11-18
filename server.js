import "dotenv/config";
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const app = express();
const root = dirname(fileURLToPath(import.meta.url));
app.use(express.json({ limit: "32kb" }));
app.use(express.static(join(root, "public")));

const fallbackEcho = ({ name = "调查员", choices = [] }) => {
  const last = choices.at(-1)?.label || "沉默地听完了广播";
  return {
    line: `${name}，你选择了“${last}”。记忆不会替你决定，但它会记住你愿意承担什么。`,
    tone: "restrained",
    source: "offline"
  };
};

app.post("/api/echo", async (req, res) => {
  const input = req.body || {};
  if (!process.env.OPENAI_API_KEY) return res.json(fallbackEcho(input));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  const prompt = `你是原创互动影游《回声终端》的叙事系统。根据玩家选择写一句不超过45字的第二人称“记忆回响”。不要剧透，不增加新事实，不评判善恶。只输出JSON：{"line":"...","tone":"restrained|tense|warm"}。\n玩家：${input.name || "调查员"}\n已知剧情：${input.summary || ""}\n选择：${JSON.stringify(input.choices || [])}`;
  try {
    const response = await fetch(`${(process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.7, response_format: { type: "json_object" }, messages: [{ role: "user", content: prompt }] }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`model returned ${response.status}`);
    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    if (typeof parsed.line !== "string" || parsed.line.length > 90) throw new Error("invalid model output");
    res.json({ line: parsed.line, tone: parsed.tone || "restrained", source: "model" });
  } catch (error) {
    res.json({ ...fallbackEcho(input), source: "fallback", reason: error.name === "AbortError" ? "timeout" : "model_error" });
  } finally {
    clearTimeout(timeout);
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true, ai: Boolean(process.env.OPENAI_API_KEY) }));
app.get("*", (_req, res) => res.sendFile(join(root, "public", "index.html")));

const port = Number(process.env.PORT || 4173);
app.listen(port, () => console.log(`Echo Terminal: http://localhost:${port}`));

export { fallbackEcho };
