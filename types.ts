export interface PlayerAttributes {
  // Pace
  acceleration: number;
  sprintSpeed: number;
  
  // Shooting
  finishing: number;
  shotPower: number;
  longShot: number;
  volleys: number;
  penalties: number;
  positioning: number; // Attacking Position
  
  // Passing
  vision: number;
  crossing: number;
  freeKick: number;
  shortPassing: number;
  longPassing: number;
  curve: number;
  
  // Dribbling
  agility: number;
  balance: number;
  reactions: number;
  ballControl: number;
  dribbling: number;
  composure: number;
  
  // Defending
  interceptions: number;
  heading: number;
  marking: number; // Defensive Awareness
  standingTackle: number;
  slidingTackle: number;
  
  // Physical
  jumping: number;
  stamina: number;
  strength: number;
  aggression: number;

  // Goalkeeping
  gkDiving: number;
  gkHandling: number;
  gkKicking: number;
  gkPositioning: number;
  gkReflexes: number;
}

export interface FaceStats {
  // Outfield
  pac: number;
  sho: number;
  pas: number;
  dri: number;
  def: number;
  phy: number;
  
  // Goalkeeper
  div?: number;
  han?: number;
  kic?: number;
  ref?: number;
  spd?: number;
  pos?: number;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TransferEvent {
  season: string;
  club: string;
  fee: string;
}

export interface InternationalStats {
  nation: string;
  caps: number;
  goals: number;
  years: string;
}

export interface PlayerCardData {
  name: string;
  club: string;
  league: string;
  nation: string;
  position: string;
  image?: string;
  overallRating: number;
  attributes: PlayerAttributes;
  faceStats: FaceStats;
  description: string;
  sources: GroundingSource[];
  
  // New History Fields
  transferHistory: TransferEvent[];
  internationalHistory: InternationalStats;
  youthCareer: string[];
}

export interface SearchState {
  isLoading: boolean;
  data: PlayerCardData | null;
  error: string | null;
}