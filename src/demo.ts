import { LlmHttpBridge } from "./index.js";

const bridge = new LlmHttpBridge();

const reply = await bridge.respond(
  {
    method: "POST",
    url: "https://api.example.com/customers",
    headers: { "content-type": "application/json" },
    bodyText: JSON.stringify({ name: "Alice", email: "a@example.com" })
  },
  [
    { role: "user", content: "We manage customers and invoices in our system." },
    { role: "assistant", content: "Got it! I can help with customer workflows." }
  ]
);

console.log(reply);