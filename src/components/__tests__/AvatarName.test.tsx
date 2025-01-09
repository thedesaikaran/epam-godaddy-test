import { render, screen } from "@testing-library/react";
import AvatarName from "../AvatarName";
import { Avatar } from "antd";

jest.mock("antd", () => ({
  Avatar: jest.fn(() => <div data-testid="mock-avatar"></div>),
}));

describe("AvatarName Component", () => {
  const mockSrc = "test-src.png";
  const mockName = "test-name";

  it("renders and displays the correct image source", () => {
    render(<AvatarName src={mockSrc} name={mockName} />);
    expect(screen.getByText(mockName)).toBeInTheDocument();
    expect(Avatar).toHaveBeenCalledWith({ src: mockSrc }, {});
  });
});
