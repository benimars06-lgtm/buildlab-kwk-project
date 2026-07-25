import { NextResponse } from "next/server";

const WEATHERAPI_CURRENT_URL = "https://api.weatherapi.com/v1/current.json";

export async function GET(request: Request) {
  const city = new URL(request.url).searchParams.get("city")?.trim();

  if (!city) {
    return NextResponse.json(
      { error: "A city query parameter is required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.WEATHERAPI_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather service is not configured." },
      { status: 500 },
    );
  }

  const weatherUrl = new URL(WEATHERAPI_CURRENT_URL);
  weatherUrl.searchParams.set("q", city);
  weatherUrl.searchParams.set("key", apiKey);

  try {
    const response = await fetch(weatherUrl, {
      headers: { Accept: "application/json" },
    });

    let data: unknown;

    try {
      data = await response.json();
    } catch {
      return NextResponse.json(
        { error: "Weather service returned an invalid response." },
        { status: 502 },
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: "Weather service request failed." },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Unable to reach the weather service." },
      { status: 502 },
    );
  }
}
