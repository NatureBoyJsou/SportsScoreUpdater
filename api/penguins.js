// api/steelers.js

const STEELERS_ID = "134925";

const LAST_EVENTS_URL = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${STEELERS_ID}`;
const NEXT_EVENTS_URL = `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${STEELERS_ID}`;

const CACHE_TTL_MS = 20 * 1000;

let _cache = { ts: 0, body: null };

export default async function handler(req, res) {
  try {
    const now = Date.now();
    if (_cache.body && now - _cache.ts < CACHE_TTL_MS) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).send(_cache.body);
    }

    const [lastRes, nextRes] = await Promise.all([
      fetch(LAST_EVENTS_URL),
      fetch(NEXT_EVENTS_URL)
    ]);
    const lastData = await lastRes.json();
    const nextData = await nextRes.json();

    console.log("DEBUG lastData:", lastData);
    console.log("DEBUG nextData:", nextData);

    const lastEvents = (lastData?.results || []).filter(ev =>
      ev.idHomeTeam === STEELERS_ID || ev.idAwayTeam === STEELERS_ID
    );
    const nextEvents = (nextData?.events || []).filter(ev =>
      ev.idHomeTeam === STEELERS_ID || ev.idAwayTeam === STEELERS_ID
    );

    const nowDate = new Date();

    // find next or today game
    const futureGames = nextEvents
      .filter(ev => new Date(ev.dateEvent) >= nowDate)
      .sort((a, b) => new Date(a.dateEvent) - new Date(b.dateEvent));

    let mainGame = null;
    if (futureGames.length > 0) {
      const g = futureGames[0];
      mainGame = { /* build from g */ };
    } else if (lastEvents.length > 0) {
      const g = lastEvents[0];
      mainGame = { /* build from g */ };
    }

    const upcomingGames = futureGames.slice(1).map(ev => ({
      gameDate: ev.dateEvent,
      home: { name: ev.strHomeTeam, score: null },
      away: { name: ev.strAwayTeam, score: null },
      status: ev.strStatus || "Scheduled"
    }));

    const payload = { fetchedAt: new Date().toISOString(), mainGame, upcomingGames };
    const body = JSON.stringify(payload);

    _cache = { ts: now, body };
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).send(body);

  } catch (err) {
    console.error("Handler error", err);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: err.toString() });
  }
}
