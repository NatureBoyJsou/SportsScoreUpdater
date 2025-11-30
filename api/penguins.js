// api/penguins.js
// ESPN-based Penguins schedule API for Vercel

const ESPN_URL =
  "https://site.web.api.espn.com/apis/v2/sports/hockey/nhl/teams/16/events?lang=en&region=us";

const CACHE_TTL_MS = 20 * 1000;

let _cache = { ts: 0, body: null };

export default async function handler(req, res) {
  try {
    const now = Date.now();

    // Serve cached result
    if (_cache.body && now - _cache.ts < CACHE_TTL_MS) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(_cache.body);
    }

    // Fetch ESPN feed
    const resp = await fetch(ESPN_URL);
    if (!resp.ok) {
      const text = await resp.text();
      console.error("ESPN error", resp.status, text);
      return res.status(502).json({
        error: "Failed to fetch ESPN",
        status: resp.status,
        body: text
      });
    }

    const data = await resp.json();
    const events = data?.events || [];

    // Separate past/future
    const nowDate = new Date();

    const past = events
      .filter(e => new Date(e.date) < nowDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const future = events
      .filter(e => new Date(e.date) >= nowDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const lastGame = past[0] || null;

    // Convert ESPN team format → your frontend’s expected structure
    function simplifyGame(g) {
      const competition = g.competitions?.[0];
      if (!competition) return null;

      const competitors = competition.competitors || [];

      const home = competitors.find(t => t.homeAway === "home");
      const away = competitors.find(t => t.homeAway === "away");

      return {
        gameDate: g.date,
        status: competition.status?.type?.description || "",
        home: {
          id: home?.id || null,
          name: home?.team?.displayName || "",
          score: home?.score != null ? Number(home.score) : null
        },
        away: {
          id: away?.id || null,
          name: away?.team?.displayName || "",
          score: away?.score != null ? Number(away.score) : null
        }
      };
    }

    const latestGame = lastGame ? simplifyGame(lastGame) : null;

    const upcomingGames = future.slice(0, 10).map(simplifyGame);

    // Build final response
    const payload = {
      fetchedAt: new Date().toISOString(),
      latestGame,
      upcomingGames
    };

    const body = JSON.stringify(payload);

    // Cache result
    _cache = { ts: now, body };

    // Send response
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(body);

  } catch (err) {
    console.error("Handler error", err);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({
      error: err?.toString() || String(err)
    });
  }
}
