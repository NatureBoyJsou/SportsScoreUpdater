// api/steelers.js
// Steelers-only API using TheSportsDB + correct date parsing

const TEAM_ID = "134925"; // Pittsburgh Steelers
const API = "https://www.thesportsdb.com/api/v1/json/123";
const CACHE_TTL = 20 * 1000;

let cache = { ts: 0, body: null };

function buildDate(g) {
  // Past games
  if (g.strTimestamp) {
    return new Date(g.strTimestamp);
  }

  // Future games
  if (g.dateEvent && g.strTime) {
    return new Date(`${g.dateEvent}T${g.strTime}`);
  }

  // Last fallback
  if (g.dateEvent) return new Date(g.dateEvent);

  return null;
}

function formatGame(g, future = false) {
  if (!g) return null;

  return {
    idEvent: g.idEvent,
    date: g.dateEvent || null,
    time: g.strTime || null,
    parsedDate: buildDate(g),
    status: g.strStatus || (future ? "Scheduled" : "Final"),
    home: {
      id: g.idHomeTeam,
      name: g.strHomeTeam,
      score: future ? null : Number(g.intHomeScore ?? null)
    },
    away: {
      id: g.idAwayTeam,
      name: g.strAwayTeam,
      score: future ? null : Number(g.intAwayScore ?? null)
    }
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const now = Date.now();

    if (cache.body && now - cache.ts < CACHE_TTL) {
      return res.status(200).send(cache.body);
    }

    const lastRes = await fetch(`${API}/eventslast.php?id=${TEAM_ID}`);
    const lastJson = await lastRes.json();
    const lastGame = lastJson?.results?.[0] || null;

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
