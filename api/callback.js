// /api/callback.js

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send('code ontbreekt');

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  if (tokenData.error) return res.status(500).json(tokenData);

  const accessToken = tokenData.access_token;

  const userResponse = await fetch('https://api.github.com/user', {
    headers: { Authorization: `token ${accessToken}` },
  });

  const userData = await userResponse.json();

  res.status(200).json(userData);
}
