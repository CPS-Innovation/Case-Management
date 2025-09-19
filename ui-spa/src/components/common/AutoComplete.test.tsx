import { render, screen, fireEvent } from "@testing-library/react";
import AutoComplete from "./AutoComplete";

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
    const option = screen.getByText("Banana");
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
});
