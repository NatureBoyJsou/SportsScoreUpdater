// api/steelers.js
// Vercel serverless function using TheSportsDB for Pittsburgh Steelers only

const STEELERS_ID = "134925";

const LAST_EVENTS_URL =
  `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${STEELERS_ID}`;

const NEXT_EVENTS_URL =
  `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${STEELERS_ID}`;

const CACHE_TTL_MS = 20 * 1000; // 20 seconds

let _cache = {
  ts: 0,
  body: null
};

export default async function handler(req, res) {
  try {
    const now = Date.now();

    if (_cache.body && now - _cache.ts < CACHE_TTL_MS) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Content-Type", "application/json");
      return res.status(200).send(_cache.body);
    }

    // Fetch last + next games
    const lastRes = await fetch(LAST_EVENTS_URL);
    const lastData = await lastRes.json();

    const nextRes = await fetch(NEXT_EVENTS_URL);
    const nextData = await nextRes.json();

    const lastEvents = (lastData.results || []).filter(
      ev => ev.idHomeTeam === STEELERS_ID || ev.idAwayTeam === STEELERS_ID
    );

    const nextEvents = (nextData.events || []).filter(
      ev => ev.idHomeTeam === STEELERS_ID || ev.idAwayTeam === STEELERS_ID
    );

    const nowDate = new Date();

    // 👉 Find NEXT or TODAY game
    const futureGames = nextEvents
      .filter(ev => new Date(ev.dateEvent) >= nowDate)
      .sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent));

    let mainGame = null;

    if (futureGames.length > 0) {
      // Use the earliest future/today game as main game
      const g = futureGames[0];
      mainGame = {
        gameDate: g.dateEvent,
        status: g.strStatus || "Scheduled",
        home: {
          id: g.idHomeTeam,
          name: g.strHomeTeam,
          score: null
        },
        away: {
          id: g.idAwayTeam,
          name: g.strAwayTeam,
          score: null
        }
      };
    } else {
      // No future games → fallback to last completed
      const lastGame = lastEvents.length ? lastEvents[0] : null;
      if (lastGame) {
        mainGame = {
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
        };
      }
    }

    // 👉 Upcoming games (excluding the main one)
    const upcomingGames = futureGames.slice(1).map(ev => ({
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

    const payload = {
      fetchedAt: new Date().toISOString(),
      mainGame,           // <-- this is what your UI should show first
      upcomingGames       // <--- rest of the schedule
    };

    const body = JSON.stringify(payload);

    _cache = { ts: now, body };

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
