// api/steelers.js
// Steelers-only API using TheSportsDB + correct date parsing

const TEAM_ID = "134925"; // ✅ Correct Pittsburgh Steelers ID
const API = "https://www.thesportsdb.com/api/v1/json/3"; // ✅ Correct public API key
const CACHE_TTL = 20 * 1000;

let cache = { ts: 0, body: null };

function buildDate(g) {
  // Past games - use strTimestamp first
  if (g.strTimestamp) {
    const d = new Date(g.strTimestamp);
    if (!isNaN(d)) return d;
  }

  // Future games (scheduled)
  if (g.dateEvent && g.strTime) {
    const dt = new Date(`${g.dateEvent}T${g.strTime}`);
    if (!isNaN(dt)) return dt;
  }

  // Basic date fallback
  if (g.dateEvent) {
    const dt2 = new Date(g.dateEvent);
    if (!isNaN(dt2)) return dt2;
  }

  return null;
}

function formatGame(g, future = false) {
  if (!g) return null;

  const parsed = buildDate(g);

  return {
    idEvent: g.idEvent,
    rawDate: g.dateEvent || null,
    rawTime: g.strTime || null,
    parsedDate: parsed ? parsed.toISOString() : null,
    status: g.strStatus || (future ? "NS" : "FT"),

    home: {
      id: g.idHomeTeam,
      name: g.strHomeTeam,
      score: future ? null : (g.intHomeScore !== null ? Number(g.intHomeScore) : null)
    },

    away: {
      id: g.idAwayTeam,
      name: g.strAwayTeam,
      score: future ? null : (g.intAwayScore !== null ? Number(g.intAwayScore) : null)
    }
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const now = Date.now();

    // Cache
    if (cache.body && now - cache.ts < CACHE_TTL) {
      return res.status(200).send(cache.body);
    }

    // Fetch last result
    const lastRes = await fetch(`${API}/eventslast.php?id=${TEAM_ID}`);
    const lastJson = await lastRes.json();
    const lastGame = lastJson?.results?.[0] || null;

    // Fetch next games
    const nextRes = await fetch(`${API}/eventsnext.php?id=${TEAM_ID}`);
    const nextJson = await nextRes.json();
    const nextGames = nextJson?.events || [];

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
    return res.status(500).json({
      error: "Server Error",
      details: err.message || String(err)
    });
  }
}
