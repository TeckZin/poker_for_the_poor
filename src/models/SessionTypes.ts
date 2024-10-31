import { Player } from './PlayerTypes'
import { DocumentReference } from 'firebase/firestore';

export interface Session {
  sessionId: string;
  name: string;
  date: string;
  players: Player[];
  totalBuyIn: number;
  totalBuyOut: number;
  bigBlind: number;
  smallBlind: number;
  parentHouseId: string;
  parentHouseIdRef: DocumentReference | null;
  hostUid: string;
  hostUidRef: DocumentReference | null;
}


export const createEmptySession = (): Session => {
    return {
        sessionId: '',
        name: '',
        date:'',
        players: [],
        totalBuyIn: 0,
        totalBuyOut: 0,
        bigBlind: 0,
        smallBlind: 0,
        parentHouseId: '',
        parentHouseIdRef: null,
        hostUid: '',
        hostUidRef: null
    };
};

export const createEmptySessions = (count: number): Session[] => {
    return Array(count).fill(null).map(() => createEmptySession());
};
