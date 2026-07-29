import { fireEvent, render, screen } from "@testing-library/react";
import ResourceList, { type Resource } from "@/components/ResourceList";

const resources: Resource[] = [
  {
    id: "resource-1",
    title: "React Guide",
    description: "Learn component fundamentals.",
    url: "https://example.com/react",
  },
  {
    id: "resource-2",
    title: "Community Handbook",
    description: "Includes practical gardening advice.",
    url: "https://example.com/community",
  },
];

describe("ResourceList", () => {
  it("renders all resources initially", () => {
    render(<ResourceList resources={resources} />);

    expect(
      screen.getByRole("heading", { name: "React Guide" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Community Handbook" })
    ).toBeInTheDocument();
  });

  it("filters resources by title without regard to case", () => {
    render(<ResourceList resources={resources} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search resources" }),
      { target: { value: "REACT" } }
    );

    expect(
      screen.getByRole("heading", { name: "React Guide" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Community Handbook" })
    ).not.toBeInTheDocument();
  });

  it("does not match resource descriptions", () => {
    render(<ResourceList resources={resources} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search resources" }),
      { target: { value: "gardening" } }
    );

    expect(
      screen.getByText("No resources match your search")
    ).toBeInTheDocument();
  });

  it("shows all resources for a whitespace-only query", () => {
    render(<ResourceList resources={resources} />);
    const searchInput = screen.getByRole("searchbox", {
      name: "Search resources",
    });

    fireEvent.change(searchInput, { target: { value: "React" } });
    fireEvent.change(searchInput, { target: { value: "   " } });

    expect(
      screen.getByRole("heading", { name: "React Guide" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Community Handbook" })
    ).toBeInTheDocument();
  });

  it("shows a dedicated message when no titles match", () => {
    render(<ResourceList resources={resources} />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search resources" }),
      { target: { value: "TypeScript" } }
    );

    expect(
      screen.getByText("No resources match your search")
    ).toBeInTheDocument();
  });

  it("shows the empty state without a search input", () => {
    render(<ResourceList resources={[]} />);

    expect(screen.getByText("No resources yet")).toBeInTheDocument();
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
  });
});
