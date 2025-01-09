import "@testing-library/jest-dom";
import { TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.console = {
  ...global.console,
  error: jest.fn(),
};
global.alert = jest.fn();
