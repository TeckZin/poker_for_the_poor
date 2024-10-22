import { DocumentReference } from 'firebase/firestore';

export interface Player {
  username: string;
  buyIn: number;
  buyOut: number;
  member: boolean;
  uid: string | null ;
  playerRef: DocumentReference | null;
}



export interface PlayerMember {
  username: string;
  email: string;
  buyIn: number;
  buyOut: number;
  uid: string;

  houseGamesPlayedIds: string[];
  sessionsPlayedIds: string[];
  houseGamesHosted: string[];
  sessionsHosted: string[];

  houseGamesPlayedIdsRef: DocumentReference[];
  sessionsPlayedIdsRef: DocumentReference[];
  houseGamesHostedRef: DocumentReference[];
  sessionsHostedRef: DocumentReference[];

}

export function createEmptyPlayerMember(): PlayerMember {
  return {
    username: '',
    email: '',
    buyIn: 0,
    buyOut: 0,
    uid: '',
    houseGamesPlayedIds: [],
    sessionsPlayedIds: [],
    houseGamesHosted: [],
    sessionsHosted: [],
    houseGamesPlayedIdsRef: [],
    sessionsPlayedIdsRef: [],
    houseGamesHostedRef: [],
    sessionsHostedRef: []
  };
}


export function convertPlayerToPlayerMember(player: Player): PlayerMember {
  if (!player.uid) {
    throw new Error("Cannot convert Player to PlayerMember: uid is null");
  }
  return {
    username: player.username,
    buyIn: player.buyIn,
    buyOut: player.buyOut,
    uid: player.uid,
    email: '',
    houseGamesPlayedIds: [],
    sessionsPlayedIds: [],
    houseGamesHosted: [],
    sessionsHosted: [],
    houseGamesPlayedIdsRef: [],
    sessionsPlayedIdsRef: [],
    houseGamesHostedRef: [],
    sessionsHostedRef: []
  };
}
