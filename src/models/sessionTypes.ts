import { Player } from './playerTypes'


export interface Session {
  sessionId: string;
  name: string;
  date: string;
  players: Player[];
  totalBuyIn: number;
  totalBuyOut: number;
  bigBlind: number;
  smallBlind: number;
  parentHostId: string;
  hostUid: string;
}

export interface Sessions {
    sessions: Session[]
}
