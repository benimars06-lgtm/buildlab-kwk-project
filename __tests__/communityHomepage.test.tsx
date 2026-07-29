import { render, screen } from "@testing-library/react";
import CommunityPage from "@/app/[communitySlug]/page";

const mockSelect = jest.fn();
const mockCommunityNav = jest.fn();
const mockNewResourceForm = jest.fn();
const mockResourceList = jest.fn();

jest.mock("@/db", () => ({
  db: {
    select: (...args: unknown[]) => mockSelect(...args),
  },
}));

jest.mock("@/components/CommunityNav", () => ({
  __esModule: true,
  default: (props: unknown) => {
    mockCommunityNav(props);
    return <div data-testid="community-nav" />;
  },
}));

jest.mock("@/components/NewResourceForm", () => ({
  __esModule: true,
  default: (props: unknown) => {
    mockNewResourceForm(props);
    return <div data-testid="new-resource-form" />;
  },
}));

jest.mock("@/components/ResourceList", () => ({
  __esModule: true,
  default: (props: unknown) => {
    mockResourceList(props);
    return <div data-testid="resource-list" />;
  },
}));

describe("CommunityPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the community homepage with data from the database", async () => {
    const community = {
      id: "community-1",
      name: "Garden Club",
      slug: "garden-club",
      description: "A place for local gardeners.",
    };

// Mock the database queries to return the community, posts, and resources
    mockSelect
      .mockReturnValueOnce({ // Mock the community query
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([community]),
        }),
      })
      .mockReturnValueOnce({ // Mock the posts query
        from: jest.fn().mockReturnValue({
          innerJoin: jest.fn().mockReturnValue({
            where: jest.fn().mockReturnValue({
              orderBy: jest.fn().mockResolvedValue([]),
            }),
          }),
        }),
      })
      .mockReturnValueOnce({ // Mock the resources query
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue([]),
        }),
      });

    const page = await CommunityPage({
      params: Promise.resolve({ communitySlug: community.slug }),
    });

    render(page);

    expect(
      screen.getByRole("heading", { level: 1, name: community.name })
    ).toBeInTheDocument();
    expect(screen.getByText(community.description)).toBeInTheDocument();
    expect(screen.getByText("No posts yet")).toBeInTheDocument();

    expect(mockCommunityNav).toHaveBeenCalledTimes(1);
    expect(mockCommunityNav.mock.calls[0][0]).toEqual({
      slug: community.slug,
      activeTab: "home",
    });

    expect(mockNewResourceForm).toHaveBeenCalledTimes(1);
    expect(mockNewResourceForm.mock.calls[0][0]).toEqual({
      communityId: community.id,
    });

    expect(mockResourceList).toHaveBeenCalledTimes(1);
    expect(mockResourceList.mock.calls[0][0]).toEqual({
      resources: [],
    });
  });
});
