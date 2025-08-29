# Anything Backend

A TypeScript library to power your backend with LLMs and respond to any API request. This project provides a bridge
between HTTP requests and LLMs, allowing you to use models like OpenAI's GPT to handle arbitrary REST API calls and
return structured JSON responses.

## Usage

### Prerequisites

Ensure the environment variable `OPENAI_API_KEY` is set with your OpenAI API key.

### Running the example Server
To start the server, run:

```sh
npm run dev
```

To use it, send any HTTP request (e.g., `POST`, `GET`) to the server endpoint. The server will use an LLM to generate a
structured JSON response based on your request. You can customize the system prompt and model in your configuration.

#### Example request flow:

Here's an example of what a session could look like:

```
Request:
HTTP GET /users/

Response:
{
  "data": []
}
```

```
Request:
HTTP POST /users/
{
  "name": "Mikael"
}

Response:
{
  "data": {
    "id": 1,
    "name": "Mikael"
  }
}
```

```
Request:
HTTP GET /users/

Response:
{
  "data": [
    {
      "id": 1,
      "name": "Mikael"
    }
  ]
}
```

## Development

### Scripts

- `npm run dev` — Start the example server in development mode
- `npm run build` — Build the library
- `npm run format` — Format code with Prettier
