// api/steelers.js
// Fully patched version — correct scoring + correct dates + stable future schedule

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

    const formatGame = (g, future = false) => {
      if (!g) return null;

      // ---- DATE FIX ----
      let gameDate = "TBD";
      if (g.strTimestamp) {
        gameDate = new Date(g.strTimestamp).toISOString();
      } else if (g.dateEvent) {
        gameDate = new Date(g.dateEvent).toISOString();
      }

      // ---- NFL SCORING FIX ----
      let homeScore = null;
      let awayScore = null;

      if (!future) {
        // home
        if (g.intHomeScore !== null && g.intHomeScore !== "") {
          homeScore = Number(g.intHomeScore);
        } else if (g.intHomeScoreTotal !== null) {
          homeScore = Number(g.intHomeScoreTotal);
        }

        // away
        if (g.intAwayScore !== null && g.intAwayScore !== "") {
          awayScore = Number(g.intAwayScore);
        } else if (g.intAwayScoreTotal !== null) {
          awayScore = Number(g.intAwayScoreTotal);
        }
      }

      return {
        idEvent: g.idEvent,
        gameDate,
        status: g.strStatus || (future ? "NS" : "FT"),
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
console.log("RAW API DATA:", json);
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

