import fetch from "isomorphic-unfetch";

const getCookieString = (cookiesObj) =>
  Object.keys(cookiesObj)
    .map((key) => `${key}=${cookiesObj[key]};`)
    .join(" ");

const filterCookieAttributes = (cookies) =>
  cookies.split(" SameSite=Lax,").map((cookie) =>
    cookie
      .split("; ")
      .filter((x) => !x.toLowerCase().startsWith("domain"))
      .filter((x) => !x.toLowerCase().startsWith("path"))
      .join("; ")
  );

async function shopifyAjaxRequest({ req, res, endpoint, method, payload }) {
  const requestOptions = {
    method,
    headers: {
      cookie: getCookieString(req.cookies),
    },
  };

  if (method === "POST" && payload) {
    requestOptions.body = JSON.stringify(payload);
    requestOptions.headers["Content-Type"] = "application/json";
  }

  try {
    let cookies, status;
    const response = await fetch(endpoint, requestOptions).then((res) => {
      cookies = filterCookieAttributes(res.headers.get("set-cookie"));
      status = res.status;

      return res.json();
    });

    res.setHeader("Set-Cookie", cookies);
    res.status(status).send(response);
  } catch (err) {
    res.status(500).send(err);
  }
}

export default async function handler(req, res) {
  const subdomain = process.env.MYSHOPIFY_DOMAIN.split(".").shift();
  const baseUrl = `https://${subdomain}.myshopify.com`;
  const {
    method,
    body: { action, payload },
  } = req;

  if (!subdomain) {
    res.status(400).send("Missing environment variable: MYSHOPIFY_DOMAIN");
  }

  if (method === "GET") {
    await shopifyAjaxRequest({
      req,
      res,
      method,
      endpoint: `${baseUrl}/cart.js`,
    });
  } else if (method === "POST") {
    if (!action) {
      res
        .status(400)
        .send(
          "POST requests to /api/cart require an `action` ('add', 'update', etc.) in the request body"
        );
    }

    await shopifyAjaxRequest({
      req,
      res,
      method,
      endpoint: `${baseUrl}/cart/${action}.js`,
      payload,
    });
  } else {
    res
      .status(400)
      .send("The /cart endpoint is only configured for GET and POST requests");
  }
}
