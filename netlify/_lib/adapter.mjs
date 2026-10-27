import { Readable } from "node:stream";

export function adaptVercelHandler(handler) {
  return async function netlifyHandler(request) {
    const rawBody = Buffer.from(await request.arrayBuffer());
    const headers = Object.fromEntries(request.headers.entries());
    const req = Readable.from(rawBody.length ? [rawBody] : []);
    const url = new URL(request.url);
    req.method = request.method;
    req.url = `${url.pathname}${url.search}`;
    req.headers = headers;

    let statusCode = 200;
    let responseBody = "";
    let ended = false;
    const responseHeaders = new Headers();
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      setHeader(name, value) {
        responseHeaders.set(name, String(value));
        return this;
      },
      end(body = "") {
        responseBody = body;
        ended = true;
        return this;
      },
    };

    try {
      await handler(req, res);
      if (!ended) {
        return Response.json({ error: "The server did not finish the request." }, { status: 500 });
      }
      return new Response(responseBody, { status: statusCode, headers: responseHeaders });
    } catch (error) {
      console.error("Netlify API adapter failed", error?.message || "Unknown error");
      return Response.json({ error: "The service is temporarily unavailable." }, { status: 500 });
    }
  };
}
