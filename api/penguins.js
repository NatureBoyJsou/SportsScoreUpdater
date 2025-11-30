// api/penguins.js
// Vercel serverless function (Node.js). Uses global cache to reduce NHL API calls.

const NHL_SCHEDULE_URL = 'https://statsapi.web.nhl.com/api/v1/schedule?teamId=5&expand=schedule.linescore';
const CACHE_TTL_MS = 20 * 1000; // 20 seconds (adjust as needed)

let _cache = {
  ts: 0,
  body: null
};

export default async function handler(req, res) {
  try {
    const now = Date.now();

    // Serve cached response if fresh
    if (_cache.body && (now - _cache.ts) < CACHE_TTL_MS) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).send(_cache.body);
    }

    // Fetch from NHL API server-side
    const r = await fetch(NHL_SCHEDULE_URL, { method: 'GET' });
    if (!r.ok) {
      const text = await r.text();
      console.error('NHL fetch error', r.status, text);
      return res
        .status(502)
        .json({ error: 'Failed to fetch NHL API', status: r.status, body: text });
    }

    const data = await r.json();

    // Simplify and compute latest game + upcoming games
    const dates = data.dates || [];
    // Build list of games (flatten)
    const games = [];
    for (const day of dates) {
      for (const g of (day.games || [])) {
        games.push(g);
      }
    }

    // Find latest (most recent past or in-progress) and the upcoming ones
    // We will assume dates appear chronological. Use gameDate to sort just in case.
    games.sort((a,b) => new Date(a.gameDate) - new Date(b.gameDate));

    // Latest = last game with status not 'Scheduled' OR if all Scheduled, pick previous if any
    let latestGame = null;
    for (let i = games.length - 1; i >= 0; i--) {
      const s = games[i].status?.detailedState || '';
      if (s && s !== 'Scheduled') { latestGame = games[i]; break; }
    }
    // If none found, pick the last one if exists
    if (!latestGame && games.length) latestGame = games[games.length -1];

    // Build upcoming (next few scheduled or future games)
    const upcoming = games
      .filter(g => (new Date(g.gameDate) >= new Date()))
      .slice(0, 10)
      .map(g => ({
        gameDate: g.gameDate,
        home: {
          id: g.teams.home.team.id,
          name: g.teams.home.team.name,
          score: g.teams.home.score
        },
        away: {
          id: g.teams.away.team.id,
          name: g.teams.away.team.name,
          score: g.teams.away.score
        },
        status: g.status?.detailedState || g.status?.abstractGameState || ''
      }));

    // Prepare payload
    const payload = {
      fetchedAt: new Date().toISOString(),
      latestGame: latestGame ? {
        gameDate: latestGame.gameDate,
        status: latestGame.status?.detailedState || latestGame.status?.abstractGameState || '',
        home: {
          id: latestGame.teams.home.team.id,
          name: latestGame.teams.home.team.name,
          score: latestGame.teams.home.score
        },
        away: {
          id: latestGame.teams.away.team.id,
          name: latestGame.teams.away.team.name,
          score: latestGame.teams.away.score
        }
      } : null,
      upcomingGames: upcoming
    };

    const body = JSON.stringify(payload);

    // cache
    _cache = { ts: now, body };

    // response with CORS enabled
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(body);
  } catch (err) {
    console.error('Handler error', err);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: err?.toString?.() || String(err) });
  }
}
