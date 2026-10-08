(() => {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = submitBtn.querySelector(".btn-text");
  const statusBox = document.getElementById("status");
  const message = document.getElementById("message");
  const counter = document.getElementById("counter");

  const API_URL = "/api/contact";

  // ---- Validation rules: each returns an error string, or "" if valid ----
  const rules = {
    name(v) {
      if (!v) return "Enter your full name.";
      if (v.length < 2) return "Name must be at least 2 characters.";
      if (!/^[\p{L}\s.'-]+$/u.test(v)) return "Use letters only in your name.";
      return "";
    },
    email(v) {
      if (!v) return "Enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email, like name@example.com.";
      return "";
    },
    phone(v) {
      if (!v) return ""; // optional
      if (!/^\+?[0-9\s-]{7,15}$/.test(v)) return "Enter 7 to 15 digits. A leading + is allowed.";
      return "";
    },
    subject(v) {
      return v ? "" : "Choose a topic.";
    },
    message(v) {
      if (!v) return "Write a message.";
      if (v.length < 10) return "Message must be at least 10 characters.";
      return "";
    }
  };

  function showError(field, text) {
    const wrapper = form.elements[field].closest(".field");
    document.getElementById(`${field}-error`).textContent = text;
    wrapper.classList.toggle("invalid", Boolean(text));
  }

  function validateField(field) {
    const value = form.elements[field].value.trim();
    const error = rules[field](value);
    showError(field, error);
    return !error;
  }

  function validateAll() {
    // run every check (no short-circuit) so all errors show at once
    const results = Object.keys(rules).map(validateField);
    return results.every(Boolean);
  }

  function setStatus(type, text) {
    statusBox.textContent = text;
    statusBox.className = text ? `status show ${type}` : "status";
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("loading", isLoading);
    btnText.textContent = isLoading ? "Sending" : "Send message";
  }

  // ---- Live feedback ----
  Object.keys(rules).forEach((field) => {
    const el = form.elements[field];
    el.addEventListener("blur", () => validateField(field));
    el.addEventListener("input", () => {
      if (el.closest(".field").classList.contains("invalid")) validateField(field);
    });
  });

  message.addEventListener("input", () => {
    counter.textContent = `${message.value.length} / ${message.maxLength}`;
  });

  // ---- Submit ----
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", "");

    if (!validateAll()) {
      const firstInvalid = form.querySelector(".invalid input, .invalid select, .invalid textarea");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      subject: form.elements.subject.value,
      message: form.elements.message.value.trim(),
      website: form.elements.website.value // honeypot
    };

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Try again in a moment.");
      }

      form.reset();
      counter.textContent = `0 / ${message.maxLength}`;
      Object.keys(rules).forEach((f) => showError(f, ""));
      setStatus("success", "Message sent. We will reply within one working day.");
    } catch (err) {
      const offline = err instanceof TypeError;
      setStatus("fail", offline ? "Could not reach the server. Check your connection and try again." : err.message);
    } finally {
      setLoading(false);
    }
  });
})();
