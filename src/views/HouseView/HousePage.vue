<template>
    <div class="flex flex-col ml-10 justify-top font-bebas-neue w-full">
        <div class="flex mt-4 flex-row justify-between">
            <p class="text-[2vw]"> House Id: {{ houseId }} </p>
            <SignOutBarComponent class="mr-7" @is-logged-in="handleLoggedInChange"> </SignOutBarComponent>
        </div>
        <div class="flex flex-row">

            <div class="w-1/4">
                <p class="text-[4vw]"> House Info </p>
                <div :class="[houseDivClass]">
                    <p :class="[housePClass]"> Name: </p>
                    <p :class="[housePClass]"> {{ currentHouse?.name }} </p>
                </div>
                <div :class="[houseDivClass]">
                    <p :class="[housePClass]"> Location: </p>
                    <p :class="[housePClass]"> {{ currentHouse?.locationValue }} </p>
                </div>
                <div :class="[houseDivClass]">
                    <p :class="[housePClass]"> Discription: </p>
                    <p :class="[housePClass]"> {{ currentHouse?.discription }} </p>
                </div>
                <div :class="[houseDivClass, 'flex-col']">
                    <p :class="[housePClass]"> Host UID: </p>
                    <p :class="[housePClass]"> {{ currentHouse?.hostUid }} </p>
                </div>
                <button class="text-[2vw] text-button-text-color" @click="() => viewMoreHouseClick()">VIEW MORE</button>
            </div>
            <div class="w-1/4">
                <div>
                    <p class="text-[4vw]"> Sessions </p>
                    <div v-if="isLoggedIn">
                        <button @click="onCreateClick" class="text-[2vw] text-[#FCF0CC]"> Create New Session </button>
                    </div>
                    <SessionsHouseListComponent :sessions="sessions" @selectedSession="viewMoreSessionClick">
                    </SessionsHouseListComponent>
                </div>
            </div>
            <div v-if="!newSessionFlag" class="w-2/4 h-full">
                <SessionDetailComponent :session="selectedSession" :isLoggedIn="isLoggedIn"> </SessionDetailComponent>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getFirestore, collection, getDoc, doc, Firestore } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import { Session } from '@/models/SessionTypes'
import { House } from '@/models/HouseTypes'
import { Player } from '@/models/PlayerTypes'
import SessionDetailComponent from '@/components/SessionComponents/SessionDetailComponent.vue'
import SignOutBarComponent from '@/components/AccountComponents/SignOutBarComponent.vue'
import SessionsHouseListComponent from '@/components/SessionComponents/SessionsHouseListComponent.vue'

export default defineComponent({
    components: {
        SessionDetailComponent,
        SignOutBarComponent,
        SessionsHouseListComponent
    },
    name: 'HousePage',
    setup() {
        const route = useRoute();
        const router = useRouter()
        const db = getFirestore();
        const sessions = ref<Session[]>([]);
        const houseId = ref(route.params.houseId as string);
        const selectedSession: Ref<Session | null> = ref(null);
        const newSessionFlag = ref(false);
        const errorMessage = ref('')
        const isLoggedIn = ref(true)
        const currentHouse: Ref<House | null> = ref(null)
        const thClass = "text-left"
        const houseDivClass = "flex flex-row text-[2vw]"
        const housePClass = "mr-5"
        const pageRouteName = ref('HousePage')

        const onCreateClick = () => {
            router.push({ name: "CreateSessionPage", params: { currHouseId: houseId.value } })
        }
        const viewMoreSessionClick = (session: Session): void => {
            selectedSession.value = session
        }


        const viewMoreHouseClick = (): void => {
            router.push({ name: 'ViewHousePage', params: { houseId: houseId.value } })
        }

        const onCreateBackClick = () => {
            newSessionFlag.value = false
        }

        const fetchHouseSessions = async (db: Firestore, houseId: string) => {
            const houseIdDocRef = doc(db, 'house_ids', houseId)
            getDoc(houseIdDocRef).then((rawData) => {
                if (rawData.exists()) {
                    const data = rawData.data();
                    currentHouse.value = {
                        ...rawData.data(),
                        houseId: rawData.id
                    } as House;
                    (currentHouse.value);
                    return fetchSessions(db, currentHouse.value.sessionsIds ?? '')
                } else {
                    ('No such document!');
                    currentHouse.value = null;
                }
            }).catch((err) => {
                errorMessage.value = err.message
            })
        };

        const fetchSessions = async (db: Firestore, sessionsIds: string[]) => {
            for (const sessionId of sessionsIds) {
                const sessionIdsDocRef = doc(db, 'session_ids', sessionId)
                getDoc(sessionIdsDocRef).then((rawData) => {
                    if (rawData.exists()) {
                        const data = rawData.data()
                        const playersArray: Player[] = Object.entries(data.players || {})
                            .map(([key, value]: [string, any]) => ({
                                username: value.username || '',
                                buyIn: Number(value.buyIn) || 0,
                                buyOut: Number(value.buyOut) || 0,
                                member: value.member || false,
                                uid: value.uid || null,
                                playerRef: value.playerRef || null
                            }));

                        const currSession: Session = {
                            sessionId: sessionId,
                            name: data.name || '',
                            date: data.date || '',
                            players: playersArray,
                            totalBuyIn: data.totalBuyIn || 0,
                            totalBuyOut: data.totalBuyOut || 0,
                            bigBlind: data.bigBlind || 0,
                            smallBlind: data.smallBlind || 0,
                            parentHouseId: data.parentHouseId || '',
                            parentHouseIdRef: data.parentHouseIdRef || null,
                            hostUid: data.hostUid || '',
                            hostUidRef: data.hostUidRef || null
                        };
                        sessions.value.push(currSession);
                    }
                })
            }
        }

        onMounted(() => {
            fetchHouseSessions(db, houseId.value);
        });

        const handleLoggedInChange = (value: boolean) => {
            isLoggedIn.value = value
        }

        return {
            houseId,
            thClass,
            sessions,
            selectedSession,
            newSessionFlag,
            isLoggedIn,
            handleLoggedInChange,
            onCreateClick,
            viewMoreSessionClick,
            viewMoreHouseClick,
            onCreateBackClick,
            currentHouse,
            houseDivClass,
            housePClass,
            pageRouteName
        }
    }
})
</script>
