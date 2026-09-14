const INDIAN_PHONE_PATTERN = /^\+91 \d{10}$/;

const normalizePhone = (phone) => {
    if (phone === undefined || phone === null || String(phone).trim() === "") {
        return "";
    }

    const value = String(phone).trim();
    const digits = value.replace(/\D/g, "");
    const localDigits = value.startsWith("+91") && digits.startsWith("91") ? digits.slice(2) : digits.slice(-10);

    return localDigits.length === 10 ? `+91 ${localDigits}` : value;
};

const isValidIndianPhone = (phone) => phone === "" || INDIAN_PHONE_PATTERN.test(phone);

module.exports = { normalizePhone, isValidIndianPhone, INDIAN_PHONE_PATTERN };
