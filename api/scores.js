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
  "Tampa Bay Lightning": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/nhl/500/tb.png&h=200&w=200",
  "Florida Panthers": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/fla.png",
  "Dallas Stars": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/dal.png",
  "Los Angeles Kings": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/la.png",
  "San Jose Sharks": "https://a.espncdn.com/i/teamlogos/nhl/500/scoreboard/sj.png",

  // ─────────── ACC / NCAA
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
  "Virginia Tech Hokies": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/259.png&h=200&w=200",
  "Duke Blue Devils": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/150.png&h=200&w=200",
  "Georgia Tech Yellow Jackets": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/59.png&h=200&w=200",
  "UCF Knights": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/2116.png&h=200&w=200",
  "Miami (OH) RedHawks": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/193.png&h=200&w=200",
  "Pitt Panthers Soccer": "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/221.png&h=200&w=200",

  // ─────────── USL CHAMPIONSHIP (24 TEAMS)
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

  // NCAA/ACC aliases
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
  "Florida State University": "Florida State Seminoles",
  "Georgia Tech": "Georgia Tech Yellow Jackets",
  "Georgia Tech Yellow Jackets": "Georgia Tech Yellow Jackets",
  "UCF": "UCF Knights",
  "Miami (OH)": "Miami (OH) RedHawks",
  "Miami OH": "Miami (OH) RedHawks",
  "Miami RedHawks": "Miami (OH) RedHawks",
  "Bucknell Bison": "Bucknell"
};

const NCAA_FOOTBALL_LOGO_IDS = {
  pittsburgpanthers: 221,
  miamioh: 193,
  miamiohredhawks: 193,
  ucf: 2116,
  ucfknights: 2116,
  syracuse: 183,
  syracuseorange: 183,
  bucknell: 2083,
  bucknellbison: 2083,
  virginiatech: 259,
  virginiatechhokies: 259,
  unc: 153,
  northcarolina: 153,
  northcarolinatarheels: 153,
  bostoncollege: 103,
  bostoncollegeeagles: 103,
  miami: 2390,
  miamifl: 2390,
  miamihurricanes: 2390,
  georgiatech: 59,
  georgiatechyellowjackets: 59,
  floridastate: 52,
  floridastateseminoles: 52,
  duke: 150,
  dukebluedevils: 150,
  ncstate: 152,
  ncstatewolfpack: 152,
  clemson: 228,
  clemsontigers: 228,
  louisville: 97,
  louisvillecardinals: 97,
  wakeforest: 154,
  wakeforestdemondeacons: 154,
  virginia: 258,
  virginiacavaliers: 258
};

function getNcaaLogoFromId(teamId) {
  return `https://a.espncdn.com/i/teamlogos/ncaa/500/${teamId}.png`;
}

function normalizeCollegeName(teamName) {
  return String(teamName || "")
    .toLowerCase()
    .replace(/#\d+/g, "")
    .replace(/\(\s*([^)]+)\s*\)/g, "$1")
    .replace(/\b(university|college|state)\b/g, " $1 ")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function getESPNLogo(teamName) {
  if (ESPN_LOGOS[teamName]) return ESPN_LOGOS[teamName];
  if (LOGO_ALIASES[teamName] && ESPN_LOGOS[LOGO_ALIASES[teamName]]) {
    return ESPN_LOGOS[LOGO_ALIASES[teamName]];
  }
  const simplified = teamName.replace(/\s+(Football|Soccer|Men's|Women's).*$/i, '').trim();
  if (ESPN_LOGOS[simplified]) return ESPN_LOGOS[simplified];
  if (LOGO_ALIASES[simplified] && ESPN_LOGOS[LOGO_ALIASES[simplified]]) {
    return ESPN_LOGOS[LOGO_ALIASES[simplified]];
  }
  const normalizedKey = Object.keys(ESPN_LOGOS).find(k => k.toLowerCase() === teamName.toLowerCase());
  if (normalizedKey) return ESPN_LOGOS[normalizedKey];

  const normalizedCollegeName = normalizeCollegeName(teamName);
  if (NCAA_FOOTBALL_LOGO_IDS[normalizedCollegeName]) {
    return getNcaaLogoFromId(NCAA_FOOTBALL_LOGO_IDS[normalizedCollegeName]);
  }

  if (/pitt/i.test(teamName)) return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/221.png&h=200&w=200";
  return "https://via.placeholder.com/48?text=?";
}

const STEELERS_TV_BY_WEEK = {
  1: "WPGH",
  2: "KDKA",
  3: "KDKA",
  4: "AMAZON PRIME",
  5: "KDKA",
  6: "KDKA",
  7: "NFL NETWORK",
  8: "KDKA",
  9: "NONE (BYE)",
  10: "WPXI",
  11: "KDKA",
  12: "AMAZON PRIME",
  13: "WPXI",
  14: "ESPN",
  15: "KDKA",
  16: "TBD",
  17: "KDKA",
  18: "TBD"
};

const STEELERS_PRESEASON_TV_BY_OPPONENT = {
  "Green Bay Packers": "KDKA",
  "New York Jets": "KDKA",
  "Buffalo Bills": "KDKA"
};

const PITT_FOOTBALL_BROADCAST_BY_OPPONENT = {
  "miamioh": { tv: "The CW", radio: "93.7 The Fan" },
  "ucf": { tv: "ESPN2", radio: "93.7 The Fan" },
  "syracuse": { tv: "ESPN", radio: "93.7 The Fan" },
  "bucknell": { tv: "ACCNX", radio: "93.7 The Fan" },
  "virginiatech": { tv: "ESPN", radio: "93.7 The Fan" },
  "northcarolina": { tv: "TBD", radio: "93.7 The Fan" },
  "bostoncollege": { tv: "TBD", radio: "93.7 The Fan" },
  "miami": { tv: "TBD", radio: "93.7 The Fan" },
  "georgiatech": { tv: "TBD", radio: "93.7 The Fan" },
  "floridastate": { tv: "ESPN", radio: "93.7 The Fan" },
  "louisville": { tv: "TBD", radio: "93.7 The Fan" },
  "california": { tv: "TBD", radio: "93.7 The Fan" }
};

function normalizePittOpponent(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\(\s*oh\s*\)/g, "oh")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function getPittFootballBroadcast(homeTeam, awayTeam) {
  const opponent = homeTeam === "Pittsburgh Panthers" ? awayTeam : homeTeam;
  const key = normalizePittOpponent(opponent);
  return PITT_FOOTBALL_BROADCAST_BY_OPPONENT[key] || { tv: "TBD", radio: "93.7 The Fan" };
}

function getSteelersTV(gameDateISO, roundRaw, homeTeam, awayTeam) {
  const opponent = homeTeam === "Pittsburgh Steelers" ? awayTeam : homeTeam;
  if (opponent && STEELERS_PRESEASON_TV_BY_OPPONENT[opponent]) {
    return STEELERS_PRESEASON_TV_BY_OPPONENT[opponent];
  }

  const round = Number(roundRaw);
  if (Number.isInteger(round) && STEELERS_TV_BY_WEEK[round]) return STEELERS_TV_BY_WEEK[round];
  if (!gameDateISO || gameDateISO === "TBD") return "TBD";
  const d = new Date(gameDateISO);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false
  });
  const parts = dtf.formatToParts(d);
  let hour = null, minute = null, weekday = null;
  for (const p of parts) {
    if (p.type === "hour") hour = parseInt(p.value, 10);
    if (p.type === "minute") minute = parseInt(p.value, 10);
    if (p.type === "weekday") weekday = p.value;
  }
  const dayMap = { Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 };
  const day = dayMap[weekday] ?? d.getDay();
  if (day === 0) { if(hour===13) return "KDKA"; if(hour===20) return "WPGH"; }
  if(day===4) return "AMAZON PRIME";
  if(day===1) return "ESPN";
  return "TBD";
}

function formatGame(g, future=false, teamKey=null) {
  if(!g) return null;
  let gameDate;
  if(g.dateEvent && g.strTime) gameDate = `${g.dateEvent}T${g.strTime}`;
  else if(g.strTimestamp) gameDate = g.strTimestamp;
  else gameDate = "TBD";

  let homeScore = null;
  let awayScore = null;
  if(!future){
    homeScore = g.intHomeScore!=null?Number(g.intHomeScore):g.intHomeScoreTotal!=null?Number(g.intHomeScoreTotal):null;
    awayScore = g.intAwayScore!=null?Number(g.intAwayScore):g.intAwayScoreTotal!=null?Number(g.intAwayScoreTotal):null;
  }

  const pittBroadcast = teamKey === "pittpanthers"
    ? getPittFootballBroadcast(g.strHomeTeam, g.strAwayTeam)
    : null;

  return {
    idEvent:g.idEvent,
    gameDate,
    status:g.strStatus||(future?"NS":"FT"),
    tvChannel:
      teamKey === "steelers"
        ? getSteelersTV(gameDate, g.intRound, g.strHomeTeam, g.strAwayTeam)
        : teamKey === "pittpanthers"
          ? (pittBroadcast?.tv || g.strTVStation || "TBD")
          : (g.strTVStation || "TBD"),
    radioChannel:
      teamKey === "pittpanthers"
        ? (pittBroadcast?.radio || g.strRadioStation || "93.7 The Fan")
        : (g.strRadioStation || ""),
    home:{ id:g.idHomeTeam, name:g.strHomeTeam, score:homeScore, logo:getESPNLogo(g.strHomeTeam), strTeamBadge:getESPNLogo(g.strHomeTeam)},
    away:{ id:g.idAwayTeam, name:g.strAwayTeam, score:awayScore, logo:getESPNLogo(g.strAwayTeam), strTeamBadge:getESPNLogo(g.strAwayTeam)}
  };
}

function decodeHtmlEntities(value) {
  if (!value) return "";
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&nbsp;/g, " ")
    .replace(/&middot;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSteelersGameTime(rawGameTime, fallbackIso) {
  if (rawGameTime && !rawGameTime.startsWith("01/01/0001")) {
    const m = rawGameTime.match(
      /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+([+-]\d{2}):(\d{2})$/
    );
    if (m) {
      const [, mm, dd, yyyy, hh, min, ss, tzH, tzM] = m;
      return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}${tzH}:${tzM}`;
    }
  }
  if (fallbackIso) {
    const parsed = new Date(fallbackIso);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }
  return "TBD";
}

function parseSteelersGamesFromHtml(html) {
  const games = [];
  const cardRegex = /<div class="nfl-o-matchup-cards([^\"]*)"([^>]*)>([\s\S]*?)<\/div>\s*<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const classSuffix = match[1] || "";
    const attrs = match[2] || "";
    const cardHtml = match[3] || "";
    const ldJsonRaw = decodeHtmlEntities(match[4] || "");

    let ld;
    try {
      ld = JSON.parse(ldJsonRaw);
    } catch {
      continue;
    }

    const homeTeam = ld?.homeTeam?.name;
    const awayTeam = ld?.awayTeam?.name;
    if (!homeTeam || !awayTeam) continue;

    const gameIdMatch = attrs.match(/data-gameid="([^\"]+)"/i);
    const gameTimeMatch = attrs.match(/data-gametime="([^\"]+)"/i);
    const weekMatch = cardHtml.match(/<strong>\s*WEEK\s*(\d+)\s*<\/strong>/i);
    const tvMatch = cardHtml.match(/nfl-o-matchup-cards__media-tv--networks">\s*([^<]+)\s*</i);
    const scoreMatches = [...cardHtml.matchAll(/nfl-o-matchup-cards__team-score[^>]*>\s*(\d+)\s*</gi)];

    const gameDate = parseSteelersGameTime(gameTimeMatch?.[1], ld?.startDate);

    let status = "NS";
    if (/--post-game/i.test(classSuffix)) status = "FT";
    else if (/--in-game/i.test(classSuffix)) status = "LIVE";

    if (ld?.eventStatus === "https://schema.org/EventCancelled") status = "CANC";
    if (ld?.eventStatus === "https://schema.org/EventPostponed") status = "PPD";

    let homeScore = null;
    let awayScore = null;
    if (scoreMatches.length >= 2) {
      homeScore = Number(scoreMatches[0][1]);
      awayScore = Number(scoreMatches[1][1]);
    }

    games.push({
      idEvent: gameIdMatch?.[1] || ld?.["@id"] || `${homeTeam}-${awayTeam}-${gameDate}`,
      dateEvent: gameDate !== "TBD" ? gameDate.slice(0, 10) : null,
      strTime: gameDate !== "TBD" ? gameDate.slice(11, 19) : null,
      strTimestamp: gameDate,
      strStatus: status,
      intRound: weekMatch ? Number(weekMatch[1]) : null,
      strTVStation: decodeHtmlEntities(tvMatch?.[1] || ""),
      strHomeTeam: homeTeam,
      strAwayTeam: awayTeam,
      intHomeScore: homeScore,
      intAwayScore: awayScore
    });
  }

  return games;
}

async function fetchSteelersGamesFromSite() {
  const url = "https://www.steelers.com/schedule/";
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html,application/xhtml+xml"
    }
  });

  if (!res.ok) throw new Error(`Steelers schedule fetch failed: ${res.status}`);
  const html = await res.text();
  const games = parseSteelersGamesFromHtml(html);
  if (!games.length) throw new Error("Steelers schedule parse returned 0 games");
  return games;
}

function extractPanthersPayloadPath(html) {
  if (!html) return null;
  const direct = html.match(/\/sports\/football\/schedule\/_payload\.json\?[^"'\s<]+/i);
  if (direct?.[0]) return direct[0];
  const hrefMatch = html.match(/href="([^\"]*\/sports\/football\/schedule\/_payload\.json\?[^\"]+)"/i);
  if (hrefMatch?.[1]) return hrefMatch[1];
  return null;
}

function looksLikePanthersGame(obj) {
  if (!obj || typeof obj !== "object") return false;
  const hasDate = typeof obj.date === "string" || typeof obj.game_date === "string";
  const opponent = obj.opponent;
  const hasOpponent =
    (opponent && typeof opponent === "object" && (opponent.title || opponent.name)) ||
    typeof obj.opponent_title === "string" ||
    typeof obj.opponent_name === "string";
  return Boolean(hasDate && hasOpponent);
}

function findPanthersGamesInPayload(node, out = []) {
  if (!node) return out;
  if (Array.isArray(node)) {
    for (const item of node) findPanthersGamesInPayload(item, out);
    return out;
  }
  if (typeof node !== "object") return out;
  if (looksLikePanthersGame(node)) out.push(node);
  for (const value of Object.values(node)) {
    if (value && typeof value === "object") findPanthersGamesInPayload(value, out);
  }
  return out;
}

function normalizePanthersStatus(rawStatus, gameStateRaw, homeScore, awayScore) {
  const status = String(rawStatus || "").toUpperCase();
  if (status.includes("FINAL")) return "FT";
  if (status.includes("LIVE") || status.includes("PROGRESS") || status.includes("IN GAME")) return "LIVE";
  if (status.includes("POSTPON")) return "PPD";
  if (status.includes("CANCEL")) return "CANC";

  const gameState = Number(gameStateRaw);
  if (!Number.isNaN(gameState)) {
    if (gameState >= 400) return "FT";
    if (gameState >= 330 && gameState < 400) return "LIVE";
  }

  if (homeScore != null && awayScore != null) return "FT";
  return "NS";
}

function parsePanthersGamesFromPayload(payload) {
  const candidates = findPanthersGamesInPayload(payload);
  const normalized = [];

  for (const g of candidates) {
    const opponentName =
      g?.opponent?.title || g?.opponent?.name || g?.opponent_title || g?.opponent_name || "Opponent";

    const atVs = String(g?.at_vs || g?.atVs || "").trim().toLowerCase();
    const isHome = atVs === "vs" || atVs === "home" || atVs === "h";
    const isAway = atVs === "at" || atVs === "away" || atVs === "a";

    const homeTeam = isAway ? opponentName : "Pittsburgh Panthers";
    const awayTeam = isAway ? "Pittsburgh Panthers" : opponentName;

    const homeScoreRaw = g?.home_score ?? g?.homeScore ?? g?.score_home ?? null;
    const awayScoreRaw = g?.away_score ?? g?.awayScore ?? g?.score_away ?? null;
    const homeScore = homeScoreRaw != null && homeScoreRaw !== "" ? Number(homeScoreRaw) : null;
    const awayScore = awayScoreRaw != null && awayScoreRaw !== "" ? Number(awayScoreRaw) : null;

    const status = normalizePanthersStatus(g?.status, g?.game_state, homeScore, awayScore);
    const tv = g?.media?.tv || g?.tv || g?.broadcast || "";

    const rawDate = g?.date || g?.game_date || null;
    let dateEvent = null;
    let strTime = null;
    let strTimestamp = "TBD";
    if (rawDate) {
      const parsed = new Date(rawDate);
      if (!Number.isNaN(parsed.getTime())) {
        strTimestamp = parsed.toISOString();
        dateEvent = strTimestamp.slice(0, 10);
        strTime = strTimestamp.slice(11, 19);
      }
    }

    normalized.push({
      idEvent: String(g?.id || g?.game_id || `${dateEvent || "tbd"}-${opponentName}-${atVs || "x"}`),
      dateEvent,
      strTime,
      strTimestamp,
      strStatus: status,
      intRound: g?.week ?? null,
      strTVStation: tv || "TBD",
      strHomeTeam: homeTeam,
      strAwayTeam: awayTeam,
      intHomeScore: Number.isFinite(homeScore) ? homeScore : null,
      intAwayScore: Number.isFinite(awayScore) ? awayScore : null
    });
  }

  const deduped = [];
  const seen = new Set();
  for (const g of normalized) {
    const key = `${g.dateEvent || "tbd"}|${g.strHomeTeam}|${g.strAwayTeam}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(g);
  }

  deduped.sort((a, b) => {
    const ta = a.strTimestamp && a.strTimestamp !== "TBD" ? new Date(a.strTimestamp).getTime() : Number.MAX_SAFE_INTEGER;
    const tb = b.strTimestamp && b.strTimestamp !== "TBD" ? new Date(b.strTimestamp).getTime() : Number.MAX_SAFE_INTEGER;
    return ta - tb;
  });

  return deduped;
}

async function fetchPittPanthersGamesFromSite() {
  const pageUrl = "https://pittsburghpanthers.com/sports/football/schedule";
  const pageRes = await fetch(pageUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html,application/xhtml+xml"
    }
  });
  if (!pageRes.ok) throw new Error(`Pitt schedule page fetch failed: ${pageRes.status}`);

  const html = await pageRes.text();
  const payloadPath = extractPanthersPayloadPath(html);
  if (!payloadPath) throw new Error("Pitt payload URL not found in schedule page");

  const payloadUrl = payloadPath.startsWith("http")
    ? payloadPath
    : `https://pittsburghpanthers.com${payloadPath.startsWith("/") ? "" : "/"}${payloadPath}`;

  const payloadRes = await fetch(payloadUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json,text/plain,*/*"
    }
  });
  if (!payloadRes.ok) throw new Error(`Pitt payload fetch failed: ${payloadRes.status}`);

  const payloadJson = await payloadRes.json();
  const games = parsePanthersGamesFromPayload(payloadJson);
  if (!games.length) throw new Error("Pitt payload parse returned 0 games");
  return games;
}

const TEAM_IDS = {
  steelers:"134925",
  penguins:"134844",
  pittpanthers:"136941",
  riverhounds:"138896"
};

const API_BASE = "https://www.thesportsdb.com/api/v1/json/123";

export default async function handler(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","*");
  res.setHeader("Content-Type","application/json");

  try{
    const teamKey = (req.query.team||"").toLowerCase();
    const TEAM_ID = TEAM_IDS[teamKey];
    if(!TEAM_ID) return res.status(400).json({error:"Unknown team"});

    const now = Date.now();
    if(cache[teamKey] && now - cache[teamKey].ts < CACHE_TTL){
      return res.status(200).send(cache[teamKey].body);
    }

    let lastGames = [];
    let nextGames = [];

    if (teamKey === "steelers") {
      try {
        const steelersGames = await fetchSteelersGamesFromSite();
        const nowMs = Date.now();
        const dated = steelersGames
          .map(g => ({ g, ms: g.strTimestamp && g.strTimestamp !== "TBD" ? new Date(g.strTimestamp).getTime() : null }))
          .filter(item => item.ms !== null && !Number.isNaN(item.ms));

        lastGames = dated
          .filter(item => item.ms <= nowMs || (item.g.intHomeScore != null && item.g.intAwayScore != null))
          .sort((a, b) => b.ms - a.ms)
          .map(item => item.g);

        nextGames = dated
          .filter(item => item.ms > nowMs)
          .sort((a, b) => a.ms - b.ms)
          .map(item => item.g);

        // Keep TBD games available as upcoming when dates are not finalized.
        const tbdGames = steelersGames.filter(g => g.strTimestamp === "TBD");
        nextGames = [...nextGames, ...tbdGames];
      } catch (e) {
        console.warn("Steelers.com source failed, falling back to TheSportsDB:", e.message || e);
      }
    }

    if (teamKey === "pittpanthers") {
      try {
        const panthersGames = await fetchPittPanthersGamesFromSite();
        const nowMs = Date.now();
        const dated = panthersGames
          .map(g => ({ g, ms: g.strTimestamp && g.strTimestamp !== "TBD" ? new Date(g.strTimestamp).getTime() : null }))
          .filter(item => item.ms !== null && !Number.isNaN(item.ms));

        lastGames = dated
          .filter(item => item.ms <= nowMs || item.g.strStatus === "FT" || item.g.strStatus === "LIVE")
          .sort((a, b) => b.ms - a.ms)
          .map(item => item.g);

        nextGames = dated
          .filter(item => item.ms > nowMs && item.g.strStatus !== "FT")
          .sort((a, b) => a.ms - b.ms)
          .map(item => item.g);

        const tbdGames = panthersGames.filter(g => g.strTimestamp === "TBD");
        nextGames = [...nextGames, ...tbdGames];
      } catch (e) {
        console.warn("PittsburghPanthers.com source failed, falling back to TheSportsDB:", e.message || e);
      }
    }

    if (!lastGames.length && !nextGames.length) {
      const lastRes = await fetch(`${API_BASE}/eventslast.php?id=${TEAM_ID}`);
      const lastJson = await lastRes.json();
      lastGames = lastJson?.results || [];

      const nextRes = await fetch(`${API_BASE}/eventsnext.php?id=${TEAM_ID}`);
      const nextJson = await nextRes.json();
      nextGames = nextJson?.events || [];
    }

    // ======= NEW LOGIC: detect CURRENT/ONGOING GAME =======
    const nowISO = new Date().toISOString();
    let currentGame = null;

    // Check last games
    for(const g of lastGames){
      if(!g.dateEvent || !g.strTime) continue;
      const start = new Date(`${g.dateEvent}T${g.strTime}`).toISOString();
      const end = g.strTimeEnd?new Date(`${g.dateEvent}T${g.strTimeEnd}`).toISOString():new Date(new Date(`${g.dateEvent}T${g.strTime}`).getTime() + 3*60*60*1000).toISOString(); // default 3h
      if(start<=nowISO && nowISO<=end){
        currentGame = formatGame(g,false,teamKey);
        break;
      }
    }

    // Check next games if no live game
    if(!currentGame){
      for(const g of nextGames){
        if(!g.dateEvent || !g.strTime) continue;
        const start = new Date(`${g.dateEvent}T${g.strTime}`).toISOString();
        const end = g.strTimeEnd?new Date(`${g.dateEvent}T${g.strTimeEnd}`).toISOString():new Date(new Date(`${g.dateEvent}T${g.strTime}`).getTime() + 3*60*60*1000).toISOString();
        if(start<=nowISO && nowISO<=end){
          currentGame = formatGame(g,true,teamKey);
          break;
        }
      }
    }

    // Fallback to last game
    if(!currentGame) currentGame = lastGames[0]?formatGame(lastGames[0],false,teamKey):null;

    const nextFormatted = nextGames.map(g=>formatGame(g,true,teamKey));

    const payload = {
      team:teamKey,
      fetchedAt:new Date().toISOString(),
      latestGame: currentGame,
      nextGame: nextFormatted[0]||null,
      upcomingGames: nextFormatted
    };

    const body = JSON.stringify(payload);
    cache[teamKey] = {ts:now, body};

    return res.status(200).send(body);

  }catch(err){
    console.error(`API Error for team ${req.query.team}:`,err);
    return res.status(500).json({error:"Server Error", details:err.message||String(err)});
  }
}
