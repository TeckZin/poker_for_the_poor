export interface Player {
  name: string;
  buyIn: number;
  buyOut: number;
  member: boolean;
  uid: string | null ;
}



export interface PlayerMember {
  name: string;
  email: string;
  buyIn: number;
  buyOut: number;
  uid: string;
  houseGamesPlayedIds: string[];
  sessionsPlayedIds: string[];
  houseGamesHosted: string[];
  sessionsHosted: string[];

}

export function createEmptyPlayerMember(): PlayerMember {
  return {
    name: '',
    email: '',
    buyIn: 0,
    buyOut: 0,
    uid: '',
    houseGamesPlayedIds: [],
    sessionsPlayedIds: [],
    houseGamesHosted: [],
    sessionsHosted: []
  };
}

export function convertPlayerMemberToPlayer(playerMember: PlayerMember): Player {
  return {
    name: playerMember.name,
    buyIn: playerMember.buyIn,
    buyOut: playerMember.buyOut,
    member: true,
    uid: playerMember.uid
  };
}

export function convertPlayerToPlayerMember(player: Player): PlayerMember {
  if (!player.uid) {
    throw new Error("Cannot convert Player to PlayerMember: uid is null");
  }
  return {
    name: player.name,
    buyIn: player.buyIn,
    buyOut: player.buyOut,
    uid: player.uid,
    email: '',
    houseGamesPlayedIds: [],
    sessionsPlayedIds: [],
    houseGamesHosted: [],
    sessionsHosted: []
  };
}
