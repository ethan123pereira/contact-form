// Vercel serverless function: POST /api/contact
// Validates the form data again on the server, then saves it to Supabase (Postgres).
// SUPABASE_URL and SUPABASE_KEY are set in Vercel > Project > Settings > Environment Variables.

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const { name, email, phone, subject, message, website } = body;

  // Honeypot: bots fill this hidden field. Pretend success and drop the message.
  if (website) return res.status(200).json({ ok: true });

  const clean = {
    name: String(name || "").trim(),
    email: String(email || "").trim(),
    phone: String(phone || "").trim(),
    subject: String(subject || "").trim(),
    message: String(message || "").trim()
  };

  if (clean.name.length < 2 || clean.name.length > 80)
    return res.status(400).json({ error: "Enter a valid name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean.email) || clean.email.length > 120)
    return res.status(400).json({ error: "Enter a valid email address." });
  if (clean.phone && !/^\+?[0-9\s-]{7,15}$/.test(clean.phone))
    return res.status(400).json({ error: "Enter a valid phone number." });
  if (!clean.subject)
    return res.status(400).json({ error: "Choose a topic." });
  if (clean.message.length < 10 || clean.message.length > 1000)
    return res.status(400).json({ error: "Message must be 10 to 1000 characters." });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) {
    return res.status(500).json({ error: "Server is not configured. Add the Supabase environment variables." });
  }

  try {
    const headers = {
      "Content-Type": "application/json",
      apikey: key,
      Prefer: "return=minimal"
    };
    // Legacy JWT-style keys also need the Authorization header
    if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;

    const dbResponse = await fetch(`${url.replace(/\/$/, "")}/rest/v1/contact_messages`, {
      method: "POST",
      headers,
      body: JSON.stringify(clean)
    });

    if (!dbResponse.ok) {
      console.error("Supabase error:", dbResponse.status, await dbResponse.text());
      return res.status(502).json({ error: "Could not save your message. Try again in a moment." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Unexpected server error." });
  }
};

function safeParse(text) {
  try { return JSON.parse(text); } catch { return {}; }
}
