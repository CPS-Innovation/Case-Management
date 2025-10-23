import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import DateInputNative from "./DateInputNative";

describe("DateInputNative", () => {
  it("renders label and input and associates them via id", () => {
    render(<DateInputNative id="dob" label="Date of birth" />);
    const input = screen.getByLabelText("Date of birth");
    expect(input).toBeInTheDocument();
    expect(input.id).toBe("dob");

    expect(screen.getByText(/For example, 17\/5\/2024/i)).toBeInTheDocument();
  });

  it("renders error message when errorMessage prop is provided", () => {
    render(
      <DateInputNative
        id="dob"
        label="Date of birth"
        errorMessage="Invalid date"
      />,
    );
    const err = screen.getByTestId("dob-error-text");
    expect(err).toBeInTheDocument();
    expect(err).toHaveTextContent("Invalid date");
  });

  it("forwards ref to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<DateInputNative id="startDate" label="Start date" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.id).toBe("startDate");
  });

  it("calls onChange handler and accepts value prop", () => {
    const handleChange = vi.fn();
    render(
      <DateInputNative
        id="eventDate"
        label="Event date"
        onChange={handleChange}
        value="2024-05-17"
      />,
    );
    const input = screen.getByLabelText("Event date");
    expect((input as HTMLInputElement).value).toBe("2024-05-17");
    fireEvent.change(input, { target: { value: "2024-06-01" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("applies custom className to the input element", () => {
    render(
      <DateInputNative
        id="custom"
        label="Custom"
        className="my-custom-class"
      />,
    );
    const input = screen.getByLabelText("Custom");
    expect(input.className).toContain("my-custom-class");
  });
});
