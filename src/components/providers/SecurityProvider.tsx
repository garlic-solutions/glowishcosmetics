"use client";

import React, { useEffect } from "react";

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 1. Right-Click Prevention (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      // Allow context menu only inside input fields/textareas so paste/cut still work for forms
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.nodeName === "INPUT" ||
          target.nodeName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
    };

    // 2. Prevent Image Dragging
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).nodeName === "IMG") {
        e.preventDefault();
      }
    };

    // 3. Prevent Copying and Cutting
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.nodeName === "INPUT" ||
          target.nodeName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
    };

    const handleCut = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.nodeName === "INPUT" ||
          target.nodeName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
    };

    // 4. Disable Common DevTools and System Key Combinations
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 Key
      if (e.key === "F12" || e.keyCode === 123) {
        e.preventDefault();
        return;
      }

      // Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows/Linux) - Toggle Developer Tools
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key?.toLowerCase() === "i" || e.keyCode === 73)
      ) {
        e.preventDefault();
        return;
      }

      // Cmd+Option+J (Mac) or Ctrl+Shift+J (Windows/Linux) - Toggle Console
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key?.toLowerCase() === "j" || e.keyCode === 74)
      ) {
        e.preventDefault();
        return;
      }

      // Cmd+Option+C (Mac) or Ctrl+Shift+C (Windows/Linux) - Inspect Element
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key?.toLowerCase() === "c" || e.keyCode === 67)
      ) {
        e.preventDefault();
        return;
      }

      // Cmd+Option+U (Mac) or Ctrl+U (Windows/Linux) - View Source
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key?.toLowerCase() === "u" || e.keyCode === 85)
      ) {
        e.preventDefault();
        return;
      }

      // Cmd+S (Mac) or Ctrl+S (Windows/Linux) - Save Page As
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key?.toLowerCase() === "s" || e.keyCode === 83)
      ) {
        e.preventDefault();
        return;
      }

      // Prevent Copy Hotkeys outside of form fields
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key?.toLowerCase() === "c" || e.keyCode === 67)
      ) {
        const target = e.target as HTMLElement;
        if (
          target &&
          (target.nodeName === "INPUT" ||
            target.nodeName === "TEXTAREA" ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
      }
    };

    // Attach listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("keydown", handleKeyDown);

    // 5. Anti-Debugging Loop (Pauses inspector when DevTools is opened in Production)
    let intervalId: NodeJS.Timeout;
    if (process.env.NODE_ENV === "production") {
      const antiDebug = () => {
        const start = new Date().getTime();
        try {
          // Dynamic constructor debugger invocation avoids static analysis warnings and ESLint debugger checks
          (function () {
            return false;
          })
          ["constructor"]("debugger")();
        } catch (err) {
          // Ignore errors
        }
        const end = new Date().getTime();
        // If execution paused due to debugger (DevTools open), wipe the console
        if (end - start > 100) {
          console.clear();
        }
      };

      // Run periodically
      antiDebug();
      intervalId = setInterval(antiDebug, 1000);
    }

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("keydown", handleKeyDown);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return <>{children}</>;
}
