export const ATTRIBUTE_CATEGORIES = {
  Pace: ['acceleration', 'sprintSpeed'],
  Shooting: ['finishing', 'shotPower', 'longShot', 'volleys', 'penalties', 'positioning'],
  Passing: ['vision', 'crossing', 'freeKick', 'shortPassing', 'longPassing', 'curve'],
  Dribbling: ['agility', 'balance', 'reactions', 'ballControl', 'dribbling', 'composure'],
  Defending: ['interceptions', 'heading', 'marking', 'standingTackle', 'slidingTackle'],
  Physical: ['jumping', 'stamina', 'strength', 'aggression'],
  Goalkeeping: ['gkDiving', 'gkHandling', 'gkKicking', 'gkPositioning', 'gkReflexes']
};

export const INITIAL_PLAYER_DATA = {
  name: "Unknown",
  club: "Free Agent",
  league: "None",
  nation: "World",
  position: "ST",
  image: "",
  overallRating: 0,
  attributes: {
    acceleration: 0, sprintSpeed: 0,
    finishing: 0, shotPower: 0, longShot: 0, volleys: 0, penalties: 0, positioning: 0,
    vision: 0, crossing: 0, freeKick: 0, shortPassing: 0, longPassing: 0, curve: 0,
    agility: 0, balance: 0, reactions: 0, ballControl: 0, dribbling: 0, composure: 0,
    interceptions: 0, heading: 0, marking: 0, standingTackle: 0, slidingTackle: 0,
    jumping: 0, stamina: 0, strength: 0, aggression: 0,
    gkDiving: 0, gkHandling: 0, gkKicking: 0, gkPositioning: 0, gkReflexes: 0
  },
  faceStats: {
    pac: 0, sho: 0, pas: 0, dri: 0, def: 0, phy: 0,
    div: 0, han: 0, kic: 0, ref: 0, spd: 0, pos: 0
  },
  description: "Search for a player to generate stats.",
  sources: [],
  transferHistory: [],
  internationalHistory: {
    nation: "Unknown",
    caps: 0,
    goals: 0,
    years: ""
  },
  youthCareer: []
};