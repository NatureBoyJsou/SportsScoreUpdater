// api/steelers.js
// Fully rewritten Vercel serverless function for Pittsburgh Steelers

const TEAM_ID = "134925"; // Pittsburgh Steelers (confirmed correct ID)
const API = "https://www.thesportsdb.com/api/v1/json/3";

const CACHE_TTL = 20 * 1000; // 20 seconds
let cache = { ts: 0, body: null };

export default async function handler(req, res) {
  try {
    // CORS headers (required by Vercel frontends)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");

    const now = Date.now();

    // Serve cache if fresh
    if (cache.body && now - cache.ts < CACHE_TTL) {
      return res.status(200).send(cache.body);
    }

    //
    // 1️⃣ Fetch last Steelers game
    //
    const lastRes = await fetch(`${API}/eventslast.php?id=${TEAM_ID}`);
    const lastJson = await lastRes.json();
    const lastGame = lastJson?.results?.[0] || null;

    //
    // 2️⃣ Fetch next Steelers game
    //
    const nextRes = await fetch(`${API}/eventsnext.php?id=${TEAM_ID}`);
    const nextJson = await nextRes.json();
    const nextGame = nextJson?.events?.[0] || null;

    //
    // 3️⃣ Clean format (always return consistent structure)
    //
    const formatGame = (g, isFuture = false) => {
      if (!g) return null;
      return {
        idEvent: g.idEvent,
        date: g.dateEvent,
        time: g.strTimeLocal || g.strTime || null,
        timestamp: g.strTimestamp || null,
        status: g.strStatus || (isFuture ? "Scheduled" : "Final"),
        home: {
          id: g.idHomeTeam,
          name: g.strHomeTeam,
          score: isFuture ? null : Number(g.intHomeScore || null),
          badge: g.strHomeTeamBadge || null
        },
        away: {
          id: g.idAwayTeam,
          name: g.strAwayTeam,
          score: isFuture ? null : Number(g.intAwayScore || null),
          badge: g.strAwayTeamBadge || null
        },
        venue: g.strVenue || null,
        city: g.strCity || null,
        season: g.strSeason || null
      };
    };

    const payload = {
      team: "Pittsburgh Steelers",
      updated: new Date().toISOString(),
      lastGame: formatGame(lastGame, false),
      nextGame: formatGame(nextGame, true),
      upcomingAvailable: Boolean(nextGame)
    };

    const body = JSON.stringify(payload);

    // Update cache
    cache = { ts: now, body };

    return res.status(200).send(body);

  } catch (err) {
    console.error("Steelers API ERROR:", err);

    res.status(500).json({
      error: "Server Error",
      details: err.message || String(err)
    });
  }
}
