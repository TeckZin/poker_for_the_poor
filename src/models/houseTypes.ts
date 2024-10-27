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


export const createEmptyHouse = (): House => {
    return {
        houseId: '',
        hostUid: '',
        sessionsIds: [],
        sessionsIdsRef: [],
        totalPlayers: 0,
        totalBuyIn: 0,
        name: '',
        locationValue: '',
        discription: ''
    };
};
