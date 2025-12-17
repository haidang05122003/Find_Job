import React, { useRef, useState, useEffect } from "react";

interface OtpInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export default function OtpInput({
    length = 6,
    value,
    onChange,
    disabled = false,
}: OtpInputProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Sync internal state with external value prop
        const newOtp = value.split("").slice(0, length);
        while (newOtp.length < length) newOtp.push("");
        setOtp(newOtp);
    }, [value, length]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        index: number
    ) => {
        const val = e.target.value;
        if (isNaN(Number(val))) return;

        const newOtp = [...otp];
        // Take the last character entered (to handle overwrite)
        newOtp[index] = val.substring(val.length - 1);

        // Call onChange with the new complete string
        onChange(newOtp.join(""));

        // Move to next input if value is entered
        if (val && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                // If current is empty and backspace pressed, move to previous and clear it
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                onChange(newOtp.join(""));
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, length);
        if (!/^\d+$/.test(pastedData)) return; // Only allow digits

        const newOtp = pastedData.split("");
        while (newOtp.length < length) newOtp.push("");

        onChange(newOtp.join(""));

        // Focus the last filled input or the first empty one
        const focusIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[focusIndex]?.focus();
    };

    return (
        <div className="flex gap-2 sm:gap-4 justify-center">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(ref) => {
                        inputRefs.current[index] = ref;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all
            ${disabled ? "bg-gray-100 text-gray-400" : "bg-white text-gray-800 border-gray-300"}
            dark:bg-gray-800 dark:text-white dark:border-gray-700
          `}
                />
            ))}
        </div>
    );
}
