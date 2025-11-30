// api/steelers.js
// Fully patched version — correct NFL scoring + safe dates + full schedule

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

    // Serve cache
    if (cache.body && now - cache.ts < CACHE_TTL) {
      return res.status(200).send(cache.body);
    }

    // LAST GAME
    const lastRes = await fetch(`${API}/eventslast.php?id=${TEAM_ID}`);
    const lastJson = await lastRes.json();
    const lastGame = lastJson?.results?.[0] || null;

    // NEXT GAMES
    const nextRes = await fetch(`${API}/eventsnext.php?id=${TEAM_ID}`);
    const nextJson = await nextRes.json();
    const nextGames = nextJson?.events || [];

    // fixes date + scoring + status
    const formatGame = (g, future = false) => {
      if (!g) return null;

      // pick best date source
      const timestamp = g.strTimestamp || null;
      const dateEvent = g.dateEvent || null;

      let gameDate = "TBD";
      if (timestamp) gameDate = timestamp;
      else if (dateEvent) gameDate = dateEvent;

      // NFL scoring fix (uses total if normal score missing)
      const homeScore =
        !future
          ? Number(g.intHomeScore ?? g.intHomeScoreTotal ?? null)
          : null;

      const awayScore =
        !future
          ? Number(g.intAwayScore ?? g.intAwayScoreTotal ?? null)
          : null;

      return {
        idEvent: g.idEvent,
        gameDate,
        status: g.strStatus || (future ? "Scheduled" : "Final"),
        home: {
          id: g.idHomeTeam,
          name: g.strHomeTeam,
          score: homeScore,
        },
        away: {
          id: g.idAwayTeam,
          name: g.strAwayTeam,
          score: awayScore,
        }
      };
    };

    const payload = {
      team: "Pittsburgh Steelers",
      fetchedAt: new Date().toISOString(),
      latestGame: formatGame(lastGame),
      nextGame: formatGame(nextGames[0], true),
      upcomingGames: nextGames.map(g => formatGame(g, true)),
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
