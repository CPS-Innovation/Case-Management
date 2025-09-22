import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import AutoComplete from "./AutoComplete";

// Mock scrollIntoView for tests
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const options = [
  { id: "1", value: "Apple" },
  { id: "2", value: "Banana" },
  { id: "3", value: "Apricot" },
];

describe("AutoComplete", () => {
  it("renders input", () => {
    render(
      <AutoComplete options={options} onInputChange={() => {}} minLength={1} />,
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("shows dropdown when input matches options", () => {
    render(
      <AutoComplete options={options} onInputChange={() => {}} minLength={1} />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Ap" } });
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("closes dropdown on Escape", () => {
    render(
      <AutoComplete options={options} onInputChange={() => {}} minLength={1} />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Ap" } });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("selects option and closes dropdown", () => {
    const handleInputChange = vi.fn();
    render(
      <AutoComplete
        options={options}
        onInputChange={handleInputChange}
        minLength={1}
      />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Ban" } });
    const option = screen.getByRole("option", { name: /banana/i });
    fireEvent.click(option);
    expect(input).toHaveValue("Banana");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("highlights matching text in options", () => {
    render(
      <AutoComplete options={options} onInputChange={() => {}} minLength={1} />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Ap" } });
    const highlighted = screen.getAllByText("Ap");
    highlighted.forEach((el) => {
      expect(el.className).toContain("highlight");
    });
  });

  it("highlights correct option as user navigates with arrow keys", () => {
    render(
      <AutoComplete options={options} onInputChange={() => {}} minLength={1} />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "a" } });

    fireEvent.keyDown(input, { key: "ArrowDown" });
    let highlighted = screen
      .getAllByRole("option")
      .find((el) => el.getAttribute("aria-selected") === "true");
    expect(highlighted).toHaveTextContent(/Apple/i);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    highlighted = screen
      .getAllByRole("option")
      .find((el) => el.getAttribute("aria-selected") === "true");
    expect(highlighted).toHaveTextContent(/Banana/i);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    highlighted = screen
      .getAllByRole("option")
      .find((el) => el.getAttribute("aria-selected") === "true");
    expect(highlighted).toHaveTextContent(/Apricot/i);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    highlighted = screen
      .getAllByRole("option")
      .find((el) => el.getAttribute("aria-selected") === "true");
    expect(highlighted).toHaveTextContent(/Apple/i);

    fireEvent.keyDown(input, { key: "ArrowUp" });
    highlighted = screen
      .getAllByRole("option")
      .find((el) => el.getAttribute("aria-selected") === "true");
    expect(highlighted).toHaveTextContent(/Apricot/i);
  });
  it("calls handleOptionClick when pressing Enter on a list item", () => {
    render(
      <AutoComplete options={options} onInputChange={() => {}} minLength={1} />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input).toHaveValue("Apple");
  });
});
