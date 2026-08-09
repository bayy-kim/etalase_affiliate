"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

const LENGTH = 6;

export function OtpInput({ error }: { error?: string }) {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const value = digits.join("");

  const setDigit = (index: number, raw: string) => {
    const sanitized = raw.replace(/\D/g, "");
    if (!sanitized) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    // Hanya ambil digit pertama (input maxlength=1)
    const digit = sanitized[sanitized.length - 1] ?? "";
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (index < LENGTH - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    const next = Array(LENGTH).fill("");
    pasted.split("").forEach((d, i) => {
      next[i] = d;
    });
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  return (
    <div>
      <div className="flex justify-between gap-2" id="otp-container">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            aria-label={`Digit ${index + 1}`}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete="one-time-code"
            value={digit}
            onChange={(e) => setDigit(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            className={cn(
              "h-14 w-12 rounded-lg border bg-background-base text-center text-[20px] font-[600] text-text-primary transition-colors focus:border-primary-container focus:outline-none focus:ring-1 focus:ring-primary-container",
              error ? "border-error" : "border-border-subtle"
            )}
          />
        ))}
      </div>
      <input type="hidden" name="code" value={value} />
    </div>
  );
}
