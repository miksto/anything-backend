import OpenAI from "openai";
import type { BridgeOptions, HttpRequest, Message } from "./types";
import { defaultModel, defaultSystemPrompt } from "./constants";

export class LlmHttpBridge {
  private client: OpenAI;
  private readonly model: string;
  private readonly systemPrompt: string;
  private history: Message[] = [];

  constructor(opts?: BridgeOptions) {
    this.client = new OpenAI();
    this.model = opts?.model ?? defaultModel;
    this.systemPrompt = opts?.systemPrompt ?? defaultSystemPrompt;
  }

  async respond(req: HttpRequest): Promise<string> {
    const newMessage: Message = this.messageFromRequest(req);

    const inputBlocks: Message[] = [
      { role: "system", content: this.systemPrompt },
      ...this.history,
      newMessage,
    ];

    const resp = await this.client.responses.create({
      model: this.model,
      input: inputBlocks,
      text: {
        format: {
          type: "json_object",
        },
      },
    });

    this.history.push(
      newMessage,
      this.messageFromResponseText(resp.output_text),
    );

    console.log(this.history);
    console.log("---------------");

    return resp.output_text;
  }

  private messageFromResponseText(responseText: string): Message {
    return {
      role: "assistant",
      content: responseText,
    };
  }

  private messageFromRequest(req: HttpRequest): Message {
    return {
      role: "user",
      content: [`HTTP ${req.method} ${req.url}`, `${req.bodyText ?? ""}`].join(
        "\n",
      ),
    };
  }
}
