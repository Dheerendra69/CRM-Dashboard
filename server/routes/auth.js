const router = require("express").Router();
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    res.json({
      message: "User verified",
      user: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      },
    });
  } catch (err) {
    console.error("Google auth failed", err);
    res.status(401).json({ message: "Invalid ID token" });
  }
});

module.exports = router;
