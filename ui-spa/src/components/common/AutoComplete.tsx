import { Input, type InputProps } from "../govuk";
import { useState, useRef, useEffect, type FC } from "react";
import styles from "./AutoComplete.module.scss";

interface AutoCompleteProps
  extends Omit<InputProps, "onChange" | "value" | "type" | "className"> {
  options: {
    id: string;
    value: string;
  }[];
  onInputChange: (val: string) => void;
  className?: string;
  inputClassName?: string;
  minLength?: number;
}

const AutoComplete: FC<AutoCompleteProps> = ({
  options,
  minLength = 2,
  onInputChange,
  className,
  inputClassName,
  ...inputProps
}) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<
    {
      id: string;
      value: string;
    }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (inputValue.length >= minLength) {
      const filtered = options.filter((opt) =>
        opt.value.toLocaleLowerCase().includes(inputValue.toLowerCase()),
      );
      if (
        filtered.length === 1 &&
        !isOpen &&
        filtered[0].value.toLowerCase() === inputValue.toLowerCase()
      ) {
        return;
      }
      setFilteredOptions(filtered);
      setIsOpen(filtered.length > 0);
      setHighlightedIndex(-1);
    } else {
      setIsOpen(false);
      setFilteredOptions([]);
      setHighlightedIndex(-1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minLength, options, inputValue]);
  useEffect(() => {
    if (highlightedIndex !== -1 && listRef.current) {
      const listElement = listRef.current;
      const highlightedElement = listElement.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  useEffect(() => {
    onInputChange(inputValue);
  }, [inputValue, onInputChange]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleOptionClick = (option: { id: string; value: string }) => {
    setInputValue(option.value);
    setIsOpen(false);
    setFilteredOptions([]);
    setHighlightedIndex(-1);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredOptions.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex !== -1) {
        handleOptionClick(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const getHighlightedOptionText = (
    optionValue: string,
    inputValue: string,
  ) => {
    const inputLower = inputValue.toLowerCase();
    const valueLower = optionValue.toLowerCase();
    const matchIndex = valueLower.indexOf(inputLower);

    if (inputValue && matchIndex !== -1) {
      return (
        <>
          {optionValue.substring(0, matchIndex)}
          <span className={styles.highlight}>
            {optionValue.substring(matchIndex, matchIndex + inputValue.length)}
          </span>
          {optionValue.substring(matchIndex + inputValue.length)}
        </>
      );
    }
    return optionValue;
  };

  return (
    <div className={`${styles.autoComplete} ${className}  ${inputClassName}`}>
      <Input
        ref={inputRef}
        value={inputValue}
        className={`${styles.inputClassName} ${inputClassName}`}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-autocomplete="list"
        aria-controls="autocomplete-list"
        aria-expanded={isOpen}
        autoComplete="off"
        {...inputProps}
      />

      {isOpen && filteredOptions.length > 0 && (
        <div
          className={styles.autoCompleteDropdown}
          role="listbox"
          id="autocomplete-list"
        >
          <ul ref={listRef} className={styles.autoCompleteDropdownList}>
            {filteredOptions.map((option, index) => (
              <li
                role="option"
                className={`${styles.autoCompleteDropdownListItem} ${index === highlightedIndex ? styles.highlighted : ""}`}
                aria-selected={index === highlightedIndex}
                key={option.id}
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleOptionClick(option);
                  }
                }}
              >
                {getHighlightedOptionText(option.value, inputValue)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
