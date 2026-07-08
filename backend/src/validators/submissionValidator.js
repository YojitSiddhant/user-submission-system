function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[0-9+\-()\s]{7,20}$/.test(phone);
}

function validateSubmissionPayload(payload) {
  const errors = {};
  const fullName = (payload.fullName || "").trim();
  const email = (payload.email || "").trim().toLowerCase();
  const phone = (payload.phone || "").trim();
  const city = (payload.city || "").trim();

  if (!fullName) {
    errors.fullName = "Full name is required.";
  } else if (fullName.length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  if (!email) {
    errors.email = "Email address is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!city) {
    errors.city = "City is required.";
  } else if (city.length < 2) {
    errors.city = "City must be at least 2 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    normalized: {
      fullName,
      email,
      phone,
      city,
    },
  };
}

module.exports = {
  validateSubmissionPayload,
};
