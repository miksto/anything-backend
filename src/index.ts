import OpenAI from "openai";
import { z } from "zod";

export type HttpRequest = {
  method: string;                 // "GET" | "POST" | ...
  url: string;                    // absolute or relative from your API gateway
  headers?: Record<string, string>;
  bodyText?: string;              // raw body string if present
};

export type Message = { role: "system" | "user" | "assistant"; content: string };

export type BridgeOptions = {
  model?: string;                 // default below
  systemPrompt?: string;          // default below
};

const RequestSchema = z.object({
  method: z.string().min(1),
  url: z.string().min(1),
  headers: z.record(z.string()).optional(),
  bodyText: z.string().optional()
});

export class LlmHttpBridge {
  private client: OpenAI;
  private model: string;
  private systemPrompt: string;

  constructor(opts?: BridgeOptions) {
    this.client = new OpenAI(); // uses process.env.OPENAI_API_KEY
    this.model = opts?.model ?? "gpt-4o-mini";
    this.systemPrompt =
      opts?.systemPrompt ??
      "You are an API reasoning engine. Given an HTTP request and prior chat messages, produce a concise, helpful answer. " +
      "If the request seems unsafe or missing data, explain what’s needed instead.";
  }

  /**
   * Non-streaming call. You pass the current request and any prior chat messages.
   * You own persistence (e.g., Redis) outside of this class to keep it simple.
   */
  async respond(req: HttpRequest, history: Message[] = []): Promise<string> {
    const validReq = RequestSchema.parse(req);

    const instructions =
      `${this.systemPrompt}\n\n` +
      `You are given an HTTP request. Consider method, URL, headers, and body.\n` +
      `Summarize intent, infer missing context from history, and return the best possible answer.\n` +
      `Return plain text for humans (no JSON unless asked).\n`;

    const inputBlocks = [
      { role: "system" as const, content: instructions },
      ...history,
      {
        role: "user" as const,
        content:
          `HTTP Request:\n` +
          `METHOD: ${validReq.method}\nURL: ${validReq.url}\n` +
          `HEADERS:\n${JSON.stringify(validReq.headers ?? {}, null, 2)}\n` +
          `BODY:\n${validReq.bodyText ?? "<empty>"}\n`
      }
    ];

    // Responses API, non-streaming
    const resp = await this.client.responses.create({
      model: this.model,
      // You can also use `instructions` + `input` array; here we send a single array of blocks.
      input: inputBlocks
    });

    // `output_text` is the simplest way to read the final text
    return resp.output_text ?? "";
  }
}