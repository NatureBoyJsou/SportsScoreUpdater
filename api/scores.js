// api/team.js
const CACHE_TTL = 20 * 1000; // 20 seconds
let cache = {}; // per-team cache

// ESPN LOGO LOOKUP TABLE (NFL, NHL, ACC College Football)
const ESPN_LOGOS = {
  // ─────────── NFL TEAMS ───────────
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
  "Carolina Panthers": "https://a.espncdn.com/i/teamlogos/nfl/500/scoreboard/car.png",

  // ─────────── NHL TEAMS ───────────
  "Pittsburgh Penguins": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/pit.png",
  "Washington Capitals": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/wsh.png",
  "Chicago Blackhawks": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/chi.png",
  "Detroit Red Wings": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/det.png",
  "Boston Bruins": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/bos.png",
  "New York Rangers": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/nyr.png",
  "Philadelphia Flyers": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/phi.png",
  "Toronto Maple Leafs": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/tor.png",
  "Montreal Canadiens": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/mtl.png",
  "Vegas Golden Knights": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/vgk.png",
  "Colorado Avalanche": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/col.png",
  "Tampa Bay Lightning": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/tbl.png",
  "Florida Panthers": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/fla.png",
  "Dallas Stars": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/dal.png",
  "Los Angeles Kings": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/la.png",
  "San Jose Sharks": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/sj.png",

  // ─────────── ACC College Football ───────────
  "Boston College": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/bc.png",
  "Clemson": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/clemson.png",
  "Duke": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/duke.png",
  "Florida State": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/fsu.png",
  "Louisville": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/louisville.png",
  "Miami (FL)": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/miami.png",
  "NC State": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/ncstate.png",
  "North Carolina": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/northcarolina.png",
  "Pittsburgh": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/pittsburgh.png",
  "Syracuse": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/syracuse.png",
  "Virginia": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/virginia.png",
  "Virginia Tech": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/virginiatech.png",
  "Wake Forest": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/wakeforest.png",
  "Pitt Panthers": "https://a.espncdn.com/i/teamlogos/ncaa/500/scoreboard/pitt.png"
};

// Add aliases for ACC team name variations returned by SportsDB
const LOGO_ALIASES = {
  "Pitt": "Pitt Panthers",
  "Pittsburgh Panthers": "Pitt Panthers",
  "Miami": "Miami (FL)",
  "Florida State University": "Florida State",
  "North Carolina State": "NC State",
  "UNC": "North Carolina"
};

function getESPNLogo(teamName) {
  const key = ESPN_LOGOS[teamName] ? teamName
            : LOGO_ALIASES[teamName] ? LOGO_ALIASES[teamName]
            : null;
  return key ? ESPN_LOGOS[key] : "https://via.placeholder.com/48?text=?";
}

function formatGame(g, future = false) {
  if (!g) return null;

  let gameDate = g.strTimestamp ? new Date(g.strTimestamp).toISOString()
                : g.dateEvent ? new Date(g.dateEvent).toISOString()
                : "TBD";

  let homeScore = null;
  let awayScore = null;

  if (!future) {
    homeScore = g.intHomeScore != null ? Number(g.intHomeScore)
              : g.intHomeScoreTotal != null ? Number(g.intHomeScoreTotal)
              : null;
    awayScore = g.intAwayScore != null ? Number(g.intAwayScore)
              : g.intAwayScoreTotal != null ? Number(g.intAwayScoreTotal)
              : null;
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

// TEAM ID mapping
const TEAM_IDS = {
  steelers: "134925",
  penguins: "134844",
  pittpanthers: "136941"
};

const API_BASE = "https://www.thesportsdb.com/api/v1/json/123";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const teamKey = (req.query.team || "").toLowerCase();
    const TEAM_ID = TEAM_IDS[teamKey];

    if (!TEAM_ID) return res.status(400).json({ error: "Unknown team" });

    const now = Date.now();
    if (cache[teamKey] && now - cache[teamKey].ts < CACHE_TTL) {
      return res.status(200).send(cache[teamKey].body);
    }

    const lastRes = await fetch(`${API_BASE}/eventslast.php?id=${TEAM_ID}`);
    const lastJson = await lastRes.json();
    const lastGameRaw = lastJson?.results?.[0] || null;
    const lastGame = formatGame(lastGameRaw);

    const nextRes = await fetch(`${API_BASE}/eventsnext.php?id=${TEAM_ID}`);
    const nextJson = await nextRes.json();
    const nextGamesRaw = nextJson?.events || [];
    const nextFormatted = nextGamesRaw.map(g => formatGame(g, true));

    const payload = {
      team: teamKey,
      fetchedAt: new Date().toISOString(),
      latestGame: lastGame,
      nextGame: nextFormatted[0] || null,
      upcomingGames: nextFormatted
    };

    const body = JSON.stringify(payload);
    cache[teamKey] = { ts: now, body };

    return res.status(200).send(body);

  } catch (err) {
    console.error(`API Error for team ${req.query.team}:`, err);
    return res.status(500).json({
      error: "Server Error",
      details: err.message || String(err)
    });
  }
}
