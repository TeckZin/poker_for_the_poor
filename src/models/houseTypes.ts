import { DocumentReference } from 'firebase/firestore';

export interface House {
    houseId: string;
    hostUid: string;
    sessionsIds: string[];
    sessionsIdsRef: DocumentReference[];
    totalPlayers: number;
    totalBuyIn: number
    name: string;
    locationValue: string;
    discription: string;
}
