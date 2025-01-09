import { render, screen } from "@testing-library/react";
import Layout from "../Layout";

jest.mock("../../components/Header", () => () => (
  <header>Mocked Header</header>
));
jest.mock("antd", () => {
  const antd = jest.requireActual("antd");
  return {
    ...antd,
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

describe("Layout Component", () => {
  it("renders correctly with children when not loading", () => {
    render(
      <Layout loading={false}>
        <div>Test Child</div>
      </Layout>
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
    expect(screen.getByTestId("spinner")).toHaveStyle("display: none");
  });

  it("renders with <Spin /> component visible when loading", () => {
    render(
      <Layout loading={true}>
        <div>Test Child</div>
      </Layout>
    );
    expect(screen.queryByText("Test Child")).not.toBeInTheDocument();
    expect(screen.getByTestId("spinner")).toHaveStyle("display: block");
  });

  it("always includes the <Header /> component", () => {
    render(
      <Layout loading={false}>
        <div>Test Child</div>
      </Layout>
    );
    expect(screen.getByText("Mocked Header")).toBeInTheDocument();
  });
});
