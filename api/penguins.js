// api/steelers.js
// Fully patched version — correct scoring + correct dates + ESPN team logos (no API lookups)

const TEAM_ID = "134925"; // Pittsburgh Steelers
const API = "https://www.thesportsdb.com/api/v1/json/123";
const CACHE_TTL = 20 * 1000;

let cache = { ts: 0, body: null };

// ---------------------------------------------
// LOCAL NFL LOGO MAP (ESPN CDN — always works)
// ---------------------------------------------
const NFL_LOGOS = {
  "134925": "https://a.espncdn.com/i/teamlogos/nfl/500/pit.png", // Steelers
  "134907": "https://a.espncdn.com/i/teamlogos/nfl/500/buf.png", // Bills
  "134914": "https://a.espncdn.com/i/teamlogos/nfl/500/cin.png", // Bengals
  "134908": "https://a.espncdn.com/i/teamlogos/nfl/500/chi.png", // Bears
  "134916": "https://a.espncdn.com/i/teamlogos/nfl/500/cle.png", // Browns
  "134917": "https://a.espncdn.com/i/teamlogos/nfl/500/bal.png", // Ravens
  "134922": "https://a.espncdn.com/i/teamlogos/nfl/500/lar.png", // Rams
  "134932": "https://a.espncdn.com/i/teamlogos/nfl/500/sf.png", // 49ers
  // Add more as your schedule expands
};

// ---------------------------------------------
// Format single game
// ---------------------------------------------
function formatGame(g, future = false) {
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
    if (g.intHomeScore !== null && g.intHomeScore !== "") {
      homeScore = Number(g.intHomeScore);
    } else if (g.intHomeScoreTotal !== null) {
      homeScore = Number(g.intHomeScoreTotal);
    }

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
    },
  };
}

// ---------------------------------------------
// Add LOGOS locally (no fetch involved)
// ---------------------------------------------
function enrichGameWithLogosLocal(game) {
  if (!game) return game;

  return {
    ...game,
    home: {
      ...game.home,
      logo: NFL_LOGOS[game.home.id] || null,
    },
    away: {
      ...game.away,
      logo: NFL_LOGOS[game.away.id] || null,
    },
  };
}

// ---------------------------------------------
// Main API handler
// ---------------------------------------------
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
    // LAST GAME
    //
    const lastRes = await fetch(`${API}/eventslast.php?id=${TEAM_ID}`);
    const lastJson = await lastRes.json();
    const lastGameRaw = lastJson?.results?.[0] || null;
    const lastGame = enrichGameWithLogosLocal(formatGame(lastGameRaw));

    //
    // UPCOMING GAMES
    //
    const nextRes = await fetch(`${API}/eventsnext.php?id=${TEAM_ID}`);
    const nextJson = await nextRes.json();
    const nextGamesRaw = nextJson?.events || [];

    const upcoming = nextGamesRaw.map(g =>
      enrichGameWithLogosLocal(formatGame(g, true))
    );

    const payload = {
      team: "Pittsburgh Steelers",
      fetchedAt: new Date().toISOString(),
      latestGame: lastGame,
      nextGame: upcoming[0] || null,
      upcomingGames: upcoming,
    };

    const body = JSON.stringify(payload);
    cache = { ts: now, body };

    return res.status(200).send(body);

  } catch (err) {
    console.error("Steelers API Error:", err);

    return res.status(500).json({
      error: "Server Error",
      details: err.message || String(err),
    });
  }
}
