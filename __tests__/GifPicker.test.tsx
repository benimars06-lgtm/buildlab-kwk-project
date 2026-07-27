import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import GifPicker from "@/components/GifPicker";

const originalFetch = global.fetch;

afterEach(() => {
  if (originalFetch) {
    global.fetch = originalFetch;
  } else {
    Reflect.deleteProperty(global, "fetch");
  }

  delete process.env.NEXT_PUBLIC_GIPHY_API_KEY;
});

describe("GifPicker", () => {
  it("renders without crashing", async () => {
    process.env.NEXT_PUBLIC_GIPHY_API_KEY = "test-api-key";
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    });
    global.fetch = fetchMock;

    render(<GifPicker open onClose={jest.fn()} onSelect={jest.fn()} />);

    expect(
      screen.getByRole("dialog", { name: "Add a GIF" })
    ).toBeInTheDocument();
    expect(
      await screen.findByText("No GIFs found. Try another search.")
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
