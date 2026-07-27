import { fireEvent, render, screen } from "@testing-library/react";
import ResourceSearch from "@/components/ResourceSearch";

const resources = [
  {
    id: "resource-1",
    title: "Midjourney Beginner's Guide",
    description: "The official quick start guide for Midjourney.",
    url: "https://example.com/midjourney",
  },
  {
    id: "resource-2",
    title: "AI Art Ethics Reading List",
    description: "Articles about the ethical implications of AI-generated art.",
    url: "https://example.com/ethics",
  },
];

describe("ResourceSearch", () => {
  it("renders without crashing", () => {
    render(<ResourceSearch resources={resources} />);

    expect(
      screen.getByRole("heading", { name: "Midjourney Beginner's Guide" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "AI Art Ethics Reading List" })
    ).toBeInTheDocument();
  });

  it("filters resource titles case-insensitively", () => {
    render(<ResourceSearch resources={resources} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search resources" }),
      { target: { value: "MIDJOURNEY" } }
    );

    expect(
      screen.getByRole("heading", { name: "Midjourney Beginner's Guide" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "AI Art Ethics Reading List" })
    ).not.toBeInTheDocument();
  });

  it("filters resource descriptions case-insensitively", () => {
    render(<ResourceSearch resources={resources} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search resources" }),
      { target: { value: "ETHICAL IMPLICATIONS" } }
    );

    expect(
      screen.getByRole("heading", { name: "AI Art Ethics Reading List" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "Midjourney Beginner's Guide",
      })
    ).not.toBeInTheDocument();
  });

  it("restores every resource when the query is cleared", () => {
    render(<ResourceSearch resources={resources} />);
    const searchInput = screen.getByRole("searchbox", {
      name: "Search resources",
    });

    fireEvent.change(searchInput, { target: { value: "ethics" } });
    fireEvent.change(searchInput, { target: { value: "" } });

    expect(
      screen.getByRole("heading", { name: "Midjourney Beginner's Guide" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "AI Art Ethics Reading List" })
    ).toBeInTheDocument();
  });

  it("shows a dedicated message when no resources match", () => {
    render(<ResourceSearch resources={resources} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search resources" }),
      { target: { value: "gardening" } }
    );

    expect(
      screen.getByText("No resources match your search")
    ).toBeInTheDocument();
  });

  it("shows the original empty state without a search input", () => {
    render(<ResourceSearch resources={[]} />);

    expect(screen.getByText("No resources yet")).toBeInTheDocument();
    expect(
      screen.queryByRole("searchbox", { name: "Search resources" })
    ).not.toBeInTheDocument();
  });
});
