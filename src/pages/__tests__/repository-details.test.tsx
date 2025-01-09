import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useNavigate } from "react-router";
import RepositoryDetailsPage from "../repository-details";
import { fetchRepositoryDetails } from "../../api/repositories";
import { mockRepository } from "../../__mocks__/mockedRepository";

jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  return {
    ...antd,
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
jest.mock("../../api/repositories", () => ({
  fetchRepositoryDetails: jest.fn(),
}));
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useParams: () => ({
    repositoryName: "test-repo",
  }),
  useNavigate: jest.fn(),
}));

const mockFetchRepositoryDetails =
  fetchRepositoryDetails as jest.MockedFunction<typeof fetchRepositoryDetails>;

describe("RepositoryDetailsPage", () => {
  beforeEach(() => {
    mockFetchRepositoryDetails.mockResolvedValue(mockRepository);
  });

  it("fetches repository details and displays them", async () => {
    render(<RepositoryDetailsPage />, { wrapper: BrowserRouter });

    expect(screen.getByText(/Spin/i)).toHaveStyle({ display: "block" });

    await waitFor(() => {
      expect(screen.getByText(mockRepository.full_name)).toBeInTheDocument();
    });
  });

  it("displays placeholder when description is missing", async () => {
    const modifiedRepo = { ...mockRepository, description: undefined };

    mockFetchRepositoryDetails.mockResolvedValue(modifiedRepo);

    render(<RepositoryDetailsPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(
        screen.getByTestId("span-repository-description").innerHTML
      ).toEqual("--");
    });
  });

  it("renders an error and navigates to home on fetch failure", async () => {
    mockFetchRepositoryDetails.mockRejectedValue(new Error("Fetch error"));
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockImplementation(() => mockNavigate);

    render(<RepositoryDetailsPage />, { wrapper: BrowserRouter });

    expect(screen.getByText(/Spin/i)).toHaveStyle({ display: "block" });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("clone dropdown opens and copies the HTTPS Clone URL when clicked", async () => {
    userEvent.setup();
    render(<RepositoryDetailsPage />, { wrapper: BrowserRouter });

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("clone-dropdown"));
    });

    const cloneWithHTTPSElement = screen.getByText("Clone with HTTPS");
    expect(cloneWithHTTPSElement).toBeValid();

    await userEvent.click(screen.getByTestId("copy-https-clone-url"));

    const clipboardText = await navigator.clipboard.readText();

    expect(clipboardText).toEqual(mockRepository.clone_url);
  });
});
