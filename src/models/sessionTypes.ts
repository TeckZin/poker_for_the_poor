import { Player } from './playerTypes'
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

export interface Sessions {
    sessions: Session[]
}
