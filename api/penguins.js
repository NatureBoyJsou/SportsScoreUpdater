// api/steelers.js
// Fully fixed version — uses correct FREE API key 123

const TEAM_ID = "134925"; // Pittsburgh Steelers
const API = "https://www.thesportsdb.com/api/v1/json/123";

const CACHE_TTL = 20 * 1000;
let cache = { ts: 0, body: null };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const now = Date.now();

    // Serve cached version
    if (cache.body && now - cache.ts < CACHE_TTL) {
      return res.status(200).send(cache.body);
    }

    //
    // Fetch last 5 games
    //
    const lastRes = await fetch(`${API}/eventslast.php?id=${TEAM_ID}`);
    const lastJson = await lastRes.json();
    const lastGame = lastJson?.results?.[0] || null;

    //
    // Fetch next 5 games (full remaining schedule)
    //
    const nextRes = await fetch(`${API}/eventsnext.php?id=${TEAM_ID}`);
    const nextJson = await nextRes.json();
    const nextGames = nextJson?.events || [];

    // Format helpers
    const formatGame = (g, future = false) => {
      if (!g) return null;
      return {
        idEvent: g.idEvent,
        date: g.dateEvent,
        time: g.strTimeLocal || g.strTime || null,
        timestamp: g.strTimestamp || null,
        status: g.strStatus || (future ? "Scheduled" : "Final"),
        home: {
          id: g.idHomeTeam,
          name: g.strHomeTeam,
          score: future ? null : Number(g.intHomeScore || null),
        },
        away: {
          id: g.idAwayTeam,
          name: g.strAwayTeam,
          score: future ? null : Number(g.intAwayScore || null),
        }
      };
    };

    const payload = {
      team: "Pittsburgh Steelers",
      updated: new Date().toISOString(),
      latestGame: formatGame(lastGame),
      nextGame: formatGame(nextGames[0], true),
      upcomingGames: nextGames.map(g => formatGame(g, true))
    };

    const body = JSON.stringify(payload);
    cache = { ts: now, body };

    return res.status(200).send(body);

  } catch (err) {
    console.error("Steelers API Error:", err);
    return res.status(500).json({
      error: "Server Error",
      details: err.message || String(err)
    });
  }
}
