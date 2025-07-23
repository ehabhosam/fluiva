import { useEffect } from "react";

export default function useAutoFocus(inputRef: React.RefObject<HTMLInputElement>) {
    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (
                inputRef.current &&
                e.key.length === 1 &&
                /^[a-zA-Z]$/.test(e.key) &&
                !e.ctrlKey // Don't run if Ctrl is pressed
            ) {
                inputRef.current.focus();
                const { value, selectionStart, selectionEnd } = inputRef.current;
                const start = selectionStart ?? value.length;
                const end = selectionEnd ?? value.length;
                // Insert the letter at the caret position
                inputRef.current.value =
                    value.slice(0, start) + e.key + value.slice(end);
                // Move caret after inserted letter
                inputRef.current.setSelectionRange(start + 1, start + 1);
                // Prevent default so it doesn't double-insert
                e.preventDefault();
            }
        }
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [inputRef]);
}
