import HomePage from "../home";
import { fetchRepositories } from "../../api/repositories";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { mockRepository } from "../../__mocks__/mockedRepository";
import { BrowserRouter } from "react-router";

jest.mock("../../api/repositories", () => ({
  fetchRepositories: jest.fn(),
}));

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  return {
    ...antd,
    Empty: jest.fn(() => <div data-testid="mock-empty"></div>),
    Select: jest.fn(({ onChange, value, options }) => {
      return (
        <select
          data-testid="sort-dropdown"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option: Record<string, string>) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }),
    Avatar: jest.fn(() => <div data-testid="mock-avatar"></div>),
    Spin: jest.fn(({ spinning }) => (
      <div
        data-testid="spinner"
        style={{ display: spinning ? "block" : "none" }}
      >
        Spin
      </div>
    )),
  };
});

const mockRepositories: IRepositoryRecord[] = [
  mockRepository,
  {
    ...mockRepository,
    id: 2,
    name: "abc-test-repo",
    stargazers_count: 2,
    updated_at: "2023-03-30T13:53:42Z",
  },
  {
    ...mockRepository,
    id: 3,
    name: "xyz-test-repo",
    stargazers_count: 5,
    updated_at: "2023-03-30T14:53:42Z",
  },
  {
    ...mockRepository,
    id: 4,
    name: "pqr-test-repo",
    stargazers_count: 4,
    updated_at: "2023-03-30T15:52:42Z",
  },
  {
    ...mockRepository,
    id: 5,
    name: "pqr-test-repo",
    stargazers_count: 4,
    updated_at: "2023-03-30T15:53:42Z",
  },
];

const mockFetchRepositories = fetchRepositories as jest.MockedFunction<
  typeof fetchRepositories
>;

describe("HomePage to list Repositories", () => {
  beforeEach(() => {
    mockFetchRepositories.mockResolvedValue(mockRepositories);
  });
  it("displays an empty state when no repositories are available", async () => {
    mockFetchRepositories.mockResolvedValue([]);

    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByTestId("mock-empty")).toBeValid();
    });
  });

  it("fetches repositories on component mount and displays initial data", async () => {
    mockFetchRepositories.mockResolvedValue(mockRepositories);

    render(<HomePage />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(
        screen.getByText(mockRepositories[0].owner.login)
      ).toBeInTheDocument();
      expect(screen.getByText(mockRepositories[0].name)).toBeInTheDocument();
    });
  });

  it("filters repositories by name based on search input", async () => {
    render(<HomePage />, { wrapper: BrowserRouter });
    await waitFor(() => screen.getByPlaceholderText("Filter by name"));

    const searchInput = screen.getByPlaceholderText("Filter by name");
    fireEvent.change(searchInput, { target: { value: "paypal" } });
    const searchButton = searchInput.nextSibling?.firstChild;
    if (searchButton) {
      fireEvent.click(searchButton);
    }

    await waitFor(() => {
      expect(screen.getByText(mockRepositories[0].name)).toBeInTheDocument();
      expect(
        screen.queryByText(mockRepositories[1].name)
      ).not.toBeInTheDocument();
    });
  });

  it("should sort repositories when sort option is changed", async () => {
    render(<HomePage />, { wrapper: BrowserRouter });
    await waitFor(() => screen.getByTestId("sort-dropdown"));
    const select = screen.getByTestId("sort-dropdown");
    fireEvent.change(select, { target: { value: "name" } });

    const sortedRepos = screen.getByTestId("repositories-list");

    expect(sortedRepos.firstElementChild).toHaveTextContent("abc-test-repo");
  });

  it("should filter repositories considering currrent selected sort option", async () => {
    render(<HomePage />, { wrapper: BrowserRouter });
    await waitFor(() => screen.getByTestId("sort-dropdown"));
    const select = screen.getByTestId("sort-dropdown");
    fireEvent.change(select, { target: { value: "stargazers_count" } });

    const sortedRepos = screen.getByTestId("repositories-list");

    expect(sortedRepos.firstElementChild).toHaveTextContent(
      "better_spree_paypal_express"
    );

    const searchInput = screen.getByPlaceholderText("Filter by name");
    fireEvent.change(searchInput, { target: { value: "test-repo" } });
    const searchButton = searchInput.nextSibling?.firstChild;
    if (searchButton) {
      fireEvent.click(searchButton);
    }

    await waitFor(() => {
      expect(sortedRepos.firstElementChild).toHaveTextContent("xyz-test-repo");
      expect(
        screen.queryByText(mockRepositories[0].name)
      ).not.toBeInTheDocument();
    });
  });

  it("consoles an error on fetch failure", async () => {
    mockFetchRepositories.mockRejectedValue(new Error("Fetch error"));

    render(<HomePage />, { wrapper: BrowserRouter });

    expect(screen.getByText(/Spin/i)).toHaveStyle({ display: "block" });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledTimes(1);
    });
  });
});
