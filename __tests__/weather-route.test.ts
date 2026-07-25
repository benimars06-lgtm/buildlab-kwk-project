/** @jest-environment node */

import { GET } from "@/app/api/weather/route";

const originalApiKey = process.env.WEATHERAPI_API_KEY;

function requestFor(query = "") {
  return { url: `http://localhost/api/weather${query}` } as Request;
}

function weatherResponse({
  body,
  ok = true,
  status = 200,
}: {
  body: unknown;
  ok?: boolean;
  status?: number;
}) {
  return {
    json: jest.fn().mockResolvedValue(body),
    ok,
    status,
  } as unknown as Response;
}

describe("GET /api/weather", () => {
  beforeEach(() => {
    process.env.WEATHERAPI_API_KEY = "test-secret-key";
    global.fetch = jest.fn();
  });

  afterAll(() => {
    if (originalApiKey === undefined) {
      delete process.env.WEATHERAPI_API_KEY;
    } else {
      process.env.WEATHERAPI_API_KEY = originalApiKey;
    }
  });

  it("requests and returns current weather for the supplied city", async () => {
    const weather = {
      location: { name: "New York" },
      current: { temp_c: 14.2, condition: { text: "Partly cloudy" } },
    };
    jest.mocked(global.fetch).mockResolvedValue(weatherResponse({ body: weather }));

    const response = await GET(requestFor("?city=%20New%20York%20"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(weather);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [requestedUrl, options] = jest.mocked(global.fetch).mock.calls[0];
    const url = new URL(requestedUrl.toString());

    expect(`${url.origin}${url.pathname}`).toBe(
      "https://api.weatherapi.com/v1/current.json",
    );
    expect(url.searchParams.get("q")).toBe("New York");
    expect(url.searchParams.get("key")).toBe("test-secret-key");
    expect(options).toEqual({
      headers: { Accept: "application/json" },
    });
  });

  it.each(["", "?city=", "?city=%20%20%20"])(
    "returns 400 when the city is missing or empty (%s)",
    async (query) => {
      const response = await GET(requestFor(query));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: "A city query parameter is required.",
      });
      expect(global.fetch).not.toHaveBeenCalled();
    },
  );

  it("returns 500 without fetching when the API key is missing", async () => {
    delete process.env.WEATHERAPI_API_KEY;

    const response = await GET(requestFor("?city=Boston"));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "Weather service is not configured.",
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("preserves an upstream error status without exposing its body", async () => {
    jest.mocked(global.fetch).mockResolvedValue(
      weatherResponse({
        body: { message: "city not found" },
        ok: false,
        status: 404,
      }),
    );

    const response = await GET(requestFor("?city=Atlantis"));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Weather service request failed.",
    });
  });

  it("returns 502 when the weather service cannot be reached", async () => {
    jest.mocked(global.fetch).mockRejectedValue(new Error("network failure"));

    const response = await GET(requestFor("?city=Boston"));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Unable to reach the weather service.",
    });
  });

  it("returns 502 when the weather service does not return JSON", async () => {
    jest.mocked(global.fetch).mockResolvedValue({
      json: jest.fn().mockRejectedValue(new SyntaxError("invalid JSON")),
      ok: true,
      status: 200,
    } as unknown as Response);

    const response = await GET(requestFor("?city=Boston"));

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: "Weather service returned an invalid response.",
    });
  });
});
