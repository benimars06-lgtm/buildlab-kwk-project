import { render, screen } from "@testing-library/react";
import RSVPPanel from "@/components/RSVPPanel";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

jest.mock("@/lib/auth", () => ({
  useAuth: () => ({
    user: null,
  }),
}));

describe("RSVPPanel", () => {
  it("renders the RSVP button when the user is not attending", () => {
    render(
      <RSVPPanel
        eventId="event-1"
        initialAttending={false}
        initialAttendees={[]}
      />
    );

    expect(screen.getByRole("button", { name: "RSVP" })).toBeEnabled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
