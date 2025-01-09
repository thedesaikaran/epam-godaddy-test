import { render, screen } from "@testing-library/react";
import RepositoryCard from "../RepositoryCard";
import { BrowserRouter } from "react-router";
import { mockRepository } from "../../__mocks__/mockedRepository";

describe("RepositoryCard Component", () => {
  it("renders repository details correctly", () => {
    render(
      <BrowserRouter>
        <RepositoryCard repository={mockRepository} />
      </BrowserRouter>
    );

    expect(screen.getByText("Ruby")).toBeInTheDocument();
    expect(screen.getByText("MIT")).toBeInTheDocument();
    expect(screen.getByText("Updated on Mar 30, 2023")).toBeInTheDocument();
    expect(
      screen.getByText(mockRepository.stargazers_count.toString())
    ).toBeInTheDocument();
  });

  it("does not display license tag if no license is provided", () => {
    const modifiedRepo = { ...mockRepository, license: undefined };
    render(
      <BrowserRouter>
        <RepositoryCard repository={modifiedRepo} />
      </BrowserRouter>
    );
    const licenseTag = screen.queryByText("MIT");
    expect(licenseTag).not.toBeInTheDocument();
  });
});
