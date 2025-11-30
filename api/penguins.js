// api/steelers.js
// NFL version with ESPN logos only (fully patched, full-season schedule)

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

function getESPNLogo(teamName) {
  return ESPN_LOGOS[teamName] || null;
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
      score: homeScore,
      logo: getESPNLogo(g.strHomeTeam),
      strTeamBadge: getESPNLogo(g.strHomeTeam)
    },

    away: {
      id: g.idAwayTeam,
      name: g.strAwayTeam,
      score: awayScore,
      logo: getESPNLogo(g.strAwayTeam),
      strTeamBadge: getESPNLogo(g.strAwayTeam)
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

    // Fetch full season
    const season = "2024"; // update dynamically if needed
    const seasonRes = await fetch(`${API}/eventsseason.php?id=${TEAM_ID}&s=${season}`);
    const seasonJson = await seasonRes.json();
    const seasonGamesRaw = seasonJson?.events || [];

    const nowIso = new Date().toISOString();

    const upcomingRaw = seasonGamesRaw.filter(g => {
      const ts = g.strTimestamp || g.dateEvent;
      return ts && new Date(ts).toISOString() >= nowIso;
    });

    const pastRaw = seasonGamesRaw.filter(g => {
      const ts = g.strTimestamp || g.dateEvent;
      return ts && new Date(ts).toISOString() < nowIso;
    });

    const upcomingGames = upcomingRaw.map(g => formatGame(g, true));
    const pastGames = pastRaw.map(g => formatGame(g, false));

    const latestGame = pastGames[pastGames.length - 1] || null;
    const nextGame = upcomingGames[0] || null;

    const allGames = seasonGamesRaw.map(g =>
      formatGame(
        g,
        new Date(g.strTimestamp || g.dateEvent).toISOString() >= nowIso
      )
    );

    const payload = {
      team: "Pittsburgh Steelers",
      fetchedAt: new Date().toISOString(),
      latestGame,
      nextGame,
      upcomingGames,
      allGames
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
