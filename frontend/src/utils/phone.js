export const formatIndianPhone = (value) => {
    const input = String(value || "");
    const digits = input.replace(/\D/g, "");
    const localDigits = input.trim().startsWith("+91") && digits.startsWith("91") ? digits.slice(2) : digits.slice(-10);

    return localDigits ? `+91 ${localDigits.slice(0, 10)}` : "";
};

export const isValidIndianPhone = (value) => !value || /^\+91 \d{10}$/.test(value);
