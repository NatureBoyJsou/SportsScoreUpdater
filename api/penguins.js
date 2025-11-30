// api/penguins.js
// Vercel serverless function using TheSportsDB instead of the NHL API.

const LAST_EVENTS_URL = "https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=134861";
const NEXT_EVENTS_URL = "https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=134861";

const CACHE_TTL_MS = 20 * 1000; // 20 seconds

let _cache = {
  ts: 0,
  body: null
};

export default async function handler(req, res) {
  try {
    const now = Date.now();

    // Serve cached response if still fresh
    if (_cache.body && (now - _cache.ts) < CACHE_TTL_MS) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(_cache.body);
    }

    // Fetch last game
    const lastRes = await fetch(LAST_EVENTS_URL);
    const lastData = await lastRes.json();

    // Fetch next games
    const nextRes = await fetch(NEXT_EVENTS_URL);
    const nextData = await nextRes.json();

    const lastEvents = lastData.results || [];
    const nextEvents = nextData.events || [];

    // Latest game (most recent completed)
    const lastGame = lastEvents.length ? lastEvents[0] : null;

    // Convert into the simplified format your frontend expects
    const latestGame = lastGame
      ? {
          gameDate: lastGame.dateEvent,
          status: "Final",
          home: {
            id: lastGame.idHomeTeam,
            name: lastGame.strHomeTeam,
            score: Number(lastGame.intHomeScore)
          },
          away: {
            id: lastGame.idAwayTeam,
            name: lastGame.strAwayTeam,
            score: Number(lastGame.intAwayScore)
          }
        }
      : null;

    // Upcoming games (next 10)
    const upcomingGames = nextEvents.slice(0, 10).map(ev => ({
      gameDate: ev.dateEvent,
      status: ev.strStatus || "Scheduled",
      home: {
        id: ev.idHomeTeam,
        name: ev.strHomeTeam,
        score: null
      },
      away: {
        id: ev.idAwayTeam,
        name: ev.strAwayTeam,
        score: null
      }
    }));

    // Final payload
    const payload = {
      fetchedAt: new Date().toISOString(),
      latestGame,
      upcomingGames
    };

    const body = JSON.stringify(payload);

    // Store in cache
    _cache = { ts: now, body };

    // Return to client
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(body);

  } catch (err) {
    console.error("Handler error", err);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: err?.toString() || String(err) });
  }
}
