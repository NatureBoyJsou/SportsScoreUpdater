// api/steelers.js
// Vercel serverless function using TheSportsDB for Pittsburgh Steelers

const LAST_EVENTS_URL =
  "https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=134922";

const NEXT_EVENTS_URL =
  "https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=134922";

const CACHE_TTL_MS = 20 * 1000; // 20 seconds

let _cache = {
  ts: 0,
  body: null
};

export default async function handler(req, res) {
  try {
    const now = Date.now();

    // Serve cached response if fresh
    if (_cache.body && now - _cache.ts < CACHE_TTL_MS) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(_cache.body);
    }

    // Fetch last Steelers game
    const lastRes = await fetch(LAST_EVENTS_URL);
    const lastData = await lastRes.json();

    // Fetch next Steelers games
    const nextRes = await fetch(NEXT_EVENTS_URL);
    const nextData = await nextRes.json();

    const lastEvents = lastData.results || [];
    const nextEvents = nextData.events || [];

    const lastGame = lastEvents.length ? lastEvents[0] : null;

    // Convert last game into your frontend structure
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

    // Upcoming next 10 games
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

    // Save in-memory cache
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
      error: err?.toString?.() || String(err)
    });
  }
}
