export type HttpRequest = {
  method: string;
  url: string;
  bodyText: string;
};

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type BridgeOptions = {
  model?: string;
  systemPrompt?: string;
};
