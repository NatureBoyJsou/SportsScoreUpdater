// api/team.js
const CACHE_TTL = 20 * 1000; // 20 seconds
let cache = {}; // per-team cache

// ESPN LOGO LOOKUP TABLE (NFL, NHL, ACC, USL Championship)
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

  // ─────────── ACC / NCAA (fixed keys to ESPN internal names)
  // Use ESPN's canonical team names as keys so the CDN URLs resolve correctly.
  "Pittsburgh Panthers": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/221.png&h=200&w=200",
  "Clemson Tigers": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/228.png&h=200&w=200",
  "Florida State Seminoles": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/52.png&h=200&w=200",
  "North Carolina Tar Heels": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/153.png&h=200&w=200",
  "Virginia Cavaliers": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/258.png&h=200&w=200",
  "Miami Hurricanes": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2390.png&h=200&w=200",
  "Boston College Eagles": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/103.png&h=200&w=200",
  "Louisville Cardinals": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/97.png&h=200&w=200",
  "Wake Forest Demon Deacons": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/154.png&h=200&w=200",
  "NC State Wolfpack": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/152.png&h=200&w=200",
  "Syracuse Orange": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/183.png&h=200&w=200",
  "Pitt Panthers Soccer": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/221.png&h=200&w=200",

  // ─────────── USL CHAMPIONSHIP (24 TEAMS) ───────────
  // Keys prefer full club names; we alias common variants below.
  "Pittsburgh Riverhounds SC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17827.png&h=200&w=200",
  "Birmingham Legion FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19405.png&h=200&w=200",
  "Charleston Battery": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9729.png&h=200&w=200",
  "Colorado Springs Switchbacks FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17830.png&h=200&w=200",
  "Detroit City FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19179.png&h=200&w=200",
  "El Paso Locomotive FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19407.png&h=200&w=200",
  "Hartford Athletic": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19411.png&h=200&w=200",
  "Indy Eleven": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17360.png&h=200&w=200",
  "Las Vegas Lights FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18987.png&h=200&w=200",
  "Loudoun United FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19410.png&h=200&w=200",
  "Louisville City FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17832.png&h=200&w=200",
  "Memphis 901 FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19409.png&h=200&w=200",
  "Miami FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18159.png&h=200&w=200",
  "Monterey Bay FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/21370.png&h=200&w=200",
  "North Carolina FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9725.png&h=200&w=200",
  "New Mexico United": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/19412.png&h=200&w=200",
  "Oakland Roots SC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/20687.png&h=200&w=200",
  "Orange County SC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18455.png&h=200&w=200",
  "Phoenix Rising FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17850.png&h=200&w=200",
  "Rio Grande Valley FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18452.png&h=200&w=200",
  "Sacramento Republic FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17828.png&h=200&w=200",
  "Rhode Island FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/22164.png&h=200&w=200",
  "San Diego Loyal SC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17829.png&h=200&w=200", 
  "San Antonio FC": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18265.png&h=200&w=200",

  "Tampa Bay Rowdies": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/17361.png&h=200&w=200",
  "FC Tulsa": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/18446.png&h=200&w=200"
};

// Aliases — map alternate names from TheSportsDB to the ESPN keys above
const LOGO_ALIASES = {
  // USL aliases
  "Pittsburgh Riverhounds": "Pittsburgh Riverhounds SC",
  "Riverhounds SC": "Pittsburgh Riverhounds SC",
  "Riverhounds": "Pittsburgh Riverhounds SC",
  "Birmingham Legion": "Birmingham Legion FC",
  "Detroit City": "Detroit City FC",
  "El Paso Locomotive": "El Paso Locomotive FC",
  "Louisville City": "Louisville City FC",
  "Memphis 901": "Memphis 901 FC",
  "Las Vegas Lights": "Las Vegas Lights FC",
  "Loudoun United": "Loudoun United FC",
  "Oakland Roots": "Oakland Roots SC",
  "Phoenix Rising": "Phoenix Rising FC",
  "Rio Grande Valley Toros": "Rio Grande Valley FC",
  "Sacramento Republic": "Sacramento Republic FC",
  "San Diego Loyal": "San Diego Loyal SC",
  "Tulsa FC": "FC Tulsa",

  // NCAA/ACC aliases mapped to ESPN canonical names (you asked to use 'Pittsburgh Panthers')
  "Pitt": "Pittsburgh Panthers",
  "Pitt Panthers": "Pittsburgh Panthers",
  "Pittsburgh Panthers": "Pittsburgh Panthers", // canonical
  "Miami": "Miami Hurricanes",
  "Miami (FL)": "Miami Hurricanes",
  "North Carolina": "North Carolina Tar Heels",
  "UNC": "North Carolina Tar Heels",
  "NC State": "NC State Wolfpack",
  "NC State Wolfpack": "NC State Wolfpack",
  "Virginia Tech": "Virginia Tech Hokies",
  "Wake Forest": "Wake Forest Demon Deacons",
  "Boston College": "Boston College Eagles",
  "Clemson": "Clemson Tigers",
  "Duke": "Duke Blue Devils",
  "Florida State University": "Florida State Seminoles"
};

function getESPNLogo(teamName) {
  // 1️⃣ Direct match
  if (ESPN_LOGOS[teamName]) return ESPN_LOGOS[teamName];

  // 2️⃣ Alias match
  if (LOGO_ALIASES[teamName] && ESPN_LOGOS[LOGO_ALIASES[teamName]]) {
    return ESPN_LOGOS[LOGO_ALIASES[teamName]];
  }

  // 3️⃣ Remove common suffixes like "Football", "Soccer", "Men's", "Women's"
  const simplified = teamName.replace(/\s+(Football|Soccer|Men's|Women's).*$/i, '').trim();
  if (ESPN_LOGOS[simplified]) return ESPN_LOGOS[simplified];
  if (LOGO_ALIASES[simplified] && ESPN_LOGOS[LOGO_ALIASES[simplified]]) {
    return ESPN_LOGOS[LOGO_ALIASES[simplified]];
  }

  // 4️⃣ Case-insensitive search
  const normalizedKey = Object.keys(ESPN_LOGOS).find(k => k.toLowerCase() === teamName.toLowerCase());
  if (normalizedKey) return ESPN_LOGOS[normalizedKey];

  // 5️⃣ Default fallback for Pitt Panthers
  if (/pitt/i.test(teamName)) return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/221.png&h=200&w=200";

  // 6️⃣ Final generic placeholder
  return "https://via.placeholder.com/48?text=?";
}


/* ────────────────────────────────────────────────
   CUSTOM STEELERS TV CHANNEL LOGIC
   ──────────────────────────────────────────────── */
function getSteelersTV(gameDateISO) {
  if (!gameDateISO || gameDateISO === "TBD") return "TBD";

  const d = new Date(gameDateISO);

  // Timezone-safe extraction for America/New_York
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  });

  const parts = dtf.formatToParts(d);

  let hour = null;
  let minute = null;
  let weekday = null;

  for (const p of parts) {
    if (p.type === "hour") hour = parseInt(p.value, 10);
    if (p.type === "minute") minute = parseInt(p.value, 10);
    if (p.type === "weekday") weekday = p.value;
  }

  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  const day = dayMap[weekday] ?? d.getDay();

  if (day === 0) {
    if (hour === 13) return "CBS — KDKA";
    if (hour === 20) return "FOX — WPGH";
  }

  if (day === 4) return "Amazon Prime Video";
  if (day === 1) return "ESPN / ABC";

  return "TBD";
}

/* ────────────────────────────────────────────────
   FORMAT GAME (Steelers TV included)
   ──────────────────────────────────────────────── */
function formatGame(g, future = false, teamKey = null) {
  if (!g) return null;

  let gameDate;
  if (g.dateEvent && g.strTime) {
    gameDate = `${g.dateEvent}T${g.strTime}`;
  } else if (g.strTimestamp) {
    gameDate = g.strTimestamp;
  } else {
    gameDate = "TBD";
  }

  let homeScore = null;
  let awayScore = null;

  if (!future) {
    homeScore =
      g.intHomeScore != null ? Number(g.intHomeScore)
      : g.intHomeScoreTotal != null ? Number(g.intHomeScoreTotal)
      : null;

    awayScore =
      g.intAwayScore != null ? Number(g.intAwayScore)
      : g.intAwayScoreTotal != null ? Number(g.intAwayScoreTotal)
      : null;
  }

  return {
    idEvent: g.idEvent,
    gameDate,
    status: g.strStatus || (future ? "NS" : "FT"),
    tvChannel:
      teamKey === "steelers"
        ? getSteelersTV(gameDate)
        : g.strTVStation || "TBD",

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

/* ────────────────────────────────────────────────
   TEAM ID MAPPING  (added USL Riverhounds)
   ──────────────────────────────────────────────── */
const TEAM_IDS = {
  steelers: "134925",
  penguins: "134844",
  pittpanthers: "136941",

  // USL:
  riverhounds: "138896"
};

const API_BASE = "https://www.thesportsdb.com/api/v1/json/123";

/* ────────────────────────────────────────────────
   MAIN HANDLER
   ──────────────────────────────────────────────── */
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const teamKey = (req.query.team || "").toLowerCase();
    const TEAM_ID = TEAM_IDS[teamKey];

    if (!TEAM_ID)
      return res.status(400).json({ error: "Unknown team" });

    const now = Date.now();
    if (cache[teamKey] && now - cache[teamKey].ts < CACHE_TTL) {
      return res.status(200).send(cache[teamKey].body);
    }

    const lastRes = await fetch(`${API_BASE}/eventslast.php?id=${TEAM_ID}`);
    const lastJson = await lastRes.json();
    const lastGameRaw = lastJson?.results?.[0] || null;
    const lastGame = formatGame(lastGameRaw, false, teamKey);

    const nextRes = await fetch(`${API_BASE}/eventsnext.php?id=${TEAM_ID}`);
    const nextJson = await nextRes.json();
    const nextGamesRaw = nextJson?.events || [];
    const nextFormatted = nextGamesRaw.map(g => formatGame(g, true, teamKey));

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
