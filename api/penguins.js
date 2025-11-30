// api/steelers.js — Sleeper API Version

const TEAM = "PIT";     // Steelers abbreviation used by Sleeper
const YEAR = 2025;

const CACHE_TTL = 20 * 1000;
let cache = { ts: 0, body: null };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const now = Date.now();

    if (cache.body && now - cache.ts < CACHE_TTL) {
      return res.status(200).send(cache.body);
    }

    //
    // 1) Fetch full 2025 schedule
    //
    const scheduleRes = await fetch(
      `https://api.sleeper.com/schedule/nfl/regular/${YEAR}`
    );
    const schedule = await scheduleRes.json();

    //
    // 2) Fetch scores week-by-week
    //
    const scores = {};
    for (let week = 1; week <= 18; week++) {
      const sRes = await fetch(
        `https://api.sleeper.com/scores/nfl/${YEAR}/${week}`
      );
      scores[week] = await sRes.json();
    }

    //
    // 3) Format schedule into Steelers games only
    //
    const games = schedule
      .filter(g => g.away === TEAM || g.home === TEAM)
      .map(g => {
        const home = g.home;
        const away = g.away;
        const week = g.week;

        // lookup score for this game
        const scoreWeek = scores[week] || [];
        const found = scoreWeek.find(s =>
          s.home === home && s.away === away
        );

        return {
          week,
          gameDate: g.start_time ? new Date(g.start_time).toISOString() : null,
          status: found ? "FT" : "NS",
          home: {
            name: home,
            score: found ? found.home_score : null
          },
          away: {
            name: away,
            score: found ? found.away_score : null
          }
        };
      });

    // latest completed game
    const latestGame = [...games]
      .filter(g => g.status === "FT")
      .sort((a, b) => new Date(b.gameDate) - new Date(a.gameDate))[0] || null;

    // future games
    const upcomingGames = games
      .filter(g => g.status === "NS")
      .sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));

    const payload = {
      source: "Sleeper NFL",
      team: "Pittsburgh Steelers",
      year: YEAR,
      updated: new Date().toISOString(),
      latestGame,
      nextGame: upcomingGames[0] || null,
      upcomingGames
    };

    const body = JSON.stringify(payload);
    cache = { ts: now, body };

    res.status(200).send(body);

  } catch (err) {
    console.error("Sleeper API Steelers Error:", err);
    res.status(500).json({
      error: "Server Error",
      details: err.message || String(err)
    });
  }
}
