// api/steelers.js
// Fully patched version — correct scoring + correct dates + correct team logo fields

const TEAM_ID = "134925"; // Pittsburgh Steelers
const API = "https://www.thesportsdb.com/api/v1/json/123";
const CACHE_TTL = 20 * 1000;

let cache = { ts: 0, body: null };

//
// Fetch a team's logos
//
async function fetchTeam(teamId) {
  if (!teamId) return null;

  try {
    const res = await fetch(`${API}/lookupteam.php?id=${teamId}`);
    const json = await res.json();
    return json?.teams?.[0] || null;
  } catch (e) {
    console.error("Team lookup failed:", e);
    return null;
  }
}

//
// Enhance a formatted game with team logos
// *** PATCHED to return strTeamBadge + strTeamLogo ***
async function enrichGameWithLogos(game) {
  if (!game) return game;

  const [homeTeam, awayTeam] = await Promise.all([
    fetchTeam(game.home.id),
    fetchTeam(game.away.id)
  ]);

  return {
    ...game,
    home: {
      ...game.home,
      strTeamBadge: homeTeam?.strTeamBadge || null,
      strTeamLogo: homeTeam?.strTeamLogo || null
    },
    away: {
      ...game.away,
      strTeamBadge: awayTeam?.strTeamBadge || null,
      strTeamLogo: awayTeam?.strTeamLogo || null
    }
  };
}

//
// Convert raw API event into normalized object
//
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
      score: homeScore
    },

    away: {
      id: g.idAwayTeam,
      name: g.strAwayTeam,
      score: awayScore
    }
  };
}

//
// Main API handler
//
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
    const lastGame = await enrichGameWithLogos(formatGame(lastGameRaw));

    //
    // NEXT GAMES
    //
    const nextRes = await fetch(`${API}/eventsnext.php?id=${TEAM_ID}`);
    const nextJson = await nextRes.json();
    const nextGamesRaw = nextJson?.events || [];

    const nextFormatted = await Promise.all(
      nextGamesRaw.map(g => enrichGameWithLogos(formatGame(g, true)))
    );

    const payload = {
      team: "Pittsburgh Steelers",
      fetchedAt: new Date().toISOString(),
      latestGame: lastGame,
      nextGame: nextFormatted[0] || null,
      upcomingGames: nextFormatted
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
