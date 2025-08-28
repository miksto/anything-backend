import express from "express";
import { LlmHttpBridge } from "./index";

const app = express();
app.use(express.json({ limit: "1mb" }));

const bridge = new LlmHttpBridge();

app.all("*/**", async (req, res) => {
  try {
    const reply = await bridge.respond({
      method: req.method,
      url: req.originalUrl,
      bodyText: req.body ? JSON.stringify(req.body) : "",
    });

    res.status(200).type("text/plain").send(reply);
  } catch (e: any) {
    res.status(400).json({ error: e?.message ?? "Bad request" });
  }
});

app.listen(3000, () => {
  console.log("LLM bridge (catch-all) on http://localhost:3000");
});
