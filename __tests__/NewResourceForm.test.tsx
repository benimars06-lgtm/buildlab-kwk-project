import { render, screen } from "@testing-library/react";
import NewResourceForm from "@/components/NewResourceForm";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}));

describe("NewResourceForm", () => {
  it("renders without crashing", () => {
    render(<NewResourceForm communityId="community-1" />);

    expect(
      screen.getByRole("button", { name: "Add Resource" })
    ).toBeInTheDocument();
  });
});
