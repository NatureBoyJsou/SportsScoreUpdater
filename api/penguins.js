// api/steelers.js
// NFL version with ESPN logos only

const TEAM_ID = "134925"; // Pittsburgh Steelers (TheSportsDB ID)
const API = "https://www.thesportsdb.com/api/v1/json/123";
const CACHE_TTL = 20 * 1000;

let cache = { ts: 0, body: null };

//
// ───────────────────────────────────────────────────────────
//  ESPN LOGO LOOKUP TABLE
// ───────────────────────────────────────────────────────────
//
const ESPN_LOGOS = {
  "Pittsburgh Steelers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/pit.png",
  "Baltimore Ravens": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/bal.png",
  "Cleveland Browns": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cle.png",
  "Cincinnati Bengals": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/cin.png",

  "Kansas City Chiefs": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/kc.png",
  "Denver Broncos": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/den.png",
  "Las Vegas Raiders": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lv.png",
  "Los Angeles Chargers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lac.png",

  "Buffalo Bills": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/buf.png",
  "Miami Dolphins": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/mia.png",
  "New York Jets": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/nyj.png",
  "New England Patriots": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ne.png",

  "Houston Texans": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/hou.png",
  "Jacksonville Jaguars": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/jax.png",
  "Tennessee Titans": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ten.png",
  "Indianapolis Colts": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ind.png",

  "Philadelphia Eagles": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/phi.png",
  "Dallas Cowboys": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/dal.png",
  "Washington Commanders": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/wsh.png",
  "New York Giants": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/nyg.png",

  "San Francisco 49ers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sf.png",
  "Seattle Seahawks": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/sea.png",
  "Los Angeles Rams": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/lar.png",
  "Arizona Cardinals": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/ari.png",

  "Detroit Lions": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/det.png",
  "Green Bay Packers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/gb.png",
  "Chicago Bears": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/chi.png",
  "Minnesota Vikings": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/min.png",

  "Tampa Bay Buccaneers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/tb.png",
  "Atlanta Falcons": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/atl.png",
  "New Orleans Saints": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/no.png",
  "Carolina Panthers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/car.png"
};

//
// Helper to return the ESPN logo for a given team name
//
function getESPNLogo(teamName) {
  if (!teamName) return null;
  return ESPN_LOGOS[teamName] || null;
}

//
// DO NOT remove – we still fetch team ID for names
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
// Attach ESPN logos to normalized game object
//
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
      strTeamBadge: getESPNLogo(homeTeam?.strTeam),
      logo: getESPNLogo(homeTeam?.strTeam)
    },
    away: {
      ...game.away,
      strTeamBadge: getESPNLogo(awayTeam?.strTeam),
      logo: getESPNLogo(awayTeam?.strTeam)
    }
  };
}

//
// Convert raw API event → normalized object
//
function formatGame(g, future = false) {
  if (!g) return null;

  let gameDate = "TBD";
  if (g.strTimestamp) {
    gameDate = new Date(g.strTimestamp).toISOString();
  } else if (g.dateEvent) {
    gameDate = new Date(g.dateEvent).toISOString();
  }

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
// MAIN API HANDLER
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

    // LAST GAME
    const lastRes = await fetch(`${API}/eventslast.php?id=${TEAM_ID}`);
    const lastJson = await lastRes.json();
    const lastGameRaw = lastJson?.results?.[0] || null;
    const lastGame = await enrichGameWithLogos(formatGame(lastGameRaw));

    // UPCOMING
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
