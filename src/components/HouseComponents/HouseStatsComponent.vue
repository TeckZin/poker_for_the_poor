<template>
    <div class="text-[2vw]">
        <div :class="[divSectorClass]">
            <p :class="[pTitleClass]"> Average Buy In Per Session:   </p>
            <p :class="[pValueClass]"> {{ averageBuyIn }}  </p>
        </div>
        <div :class="[divSectorClass]">
            <p :class="[pTitleClass]"> Average Big Blinds:   </p>
            <p :class="[pValueClass]"> {{ averageBB }}  </p>
        </div>
        <div :class="[divSectorClass]">
            <p :class="[pTitleClass]"> Average Small Blinds:   </p>
            <p :class="[pValueClass]"> {{ averageSB }}  </p>
        </div>
        <div :class="[divSectorClass]">
            <p :class="[pTitleClass]"> Average # of Players:    </p>
            <p :class="[pValueClass]"> {{ averageAmountPlayers }}  </p>
        </div>
        <div  class="flex flex-col mt-3">
            <p> most active players </p>
            <ul>
                <li class="flex flex-row"
                    v-for="([username, count], index) in
                            [...playersAmountSessionPlayed.entries()].slice(0,5)"
                    :key="index">
                    <p :class="['mr-3']"> {{ username }}:  </p>
                    <p> {{ count }} </p>
                </li>
            </ul>



        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getFirestore, collection, getDoc, doc, Firestore, DocumentSnapshot } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import { Session, createEmptySessions, createEmptySession } from '@/models/SessionTypes'
import { House, createEmptyHouse } from '@/models/HouseTypes'
import { Player } from '@/models/PlayerTypes'

export default defineComponent({
  components: {
  },
  props: {
    houseId: {
        type: String,
        required: true

    }
  },
  name: 'HouseStatsComponents',
  setup(props) {
    const route = useRoute();
    const router = useRouter()
    const db = getFirestore();


    const divClass = ""
    const titleClass = "text-[2vw]"
    const divSectorClass = "flex flex-row"
    const pTitleClass = "mr-3"
    const pValueClass = ""


    const house = ref(createEmptyHouse())
    const sessions = ref(createEmptySessions(0))
    const averageBuyIn = ref(0)
    const averageBB = ref(0)
    const averageSB = ref(0)
    const averageAmountPlayers = ref(0)
    const playersAmountSessionPlayed: Ref<Map<string, number>> = ref(new Map())


	const getAverageBuyIn = () => {
        let totalBuyIn = 0
        sessions.value.forEach((session) => {
            totalBuyIn += session.totalBuyIn
        })

        averageBuyIn.value = totalBuyIn / sessions.value.length
    }

	const getAverageBB = () => {
        let sumBB = 0
        sessions.value.forEach((session) => {
            sumBB += session.bigBlind

        })
         averageBB.value = sumBB / sessions.value.length

	}

	const getAverageSB = () => {
        let sumSB = 0
        sessions.value.forEach((session) => {
            sumSB += session.smallBlind

        })
        averageSB.value = sumSB / sessions.value.length

	}

	const getAverageAmountPlayers = () => {
        let totalPlayers = 0
        sessions.value.forEach((session) => {
            totalPlayers += session.players.length
        })
        averageAmountPlayers.value = totalPlayers / sessions.value.length

	}

    const getPlayersAmountSessionPlayed = () => {
        const playerSessionMap = new Map<string, number>();
        sessions.value.forEach((session) => {
            session.players.forEach((player: Player) => {
                const currentCount = playerSessionMap.get(player.username) || 0;
                playerSessionMap.set(player.username, currentCount + 1);
            });
        });
        playersAmountSessionPlayed.value =  new Map(
        [...playerSessionMap.entries()].sort((a, b) => b[1] - a[1]))

    }





    const fetchSessions = async () => {
        try {
            const sessionSnapshots = await Promise.all(
                house.value.sessionsIdsRef.map(async ref => {
                    try {
                        return await getDoc(ref)
                    } catch (err) {
                        console.error(`Failed to fetch session: ${ref.id}`, err)
                        return null
                    }
                })
            )

            const finalSessions = sessionSnapshots
                .filter((snapshot): snapshot is DocumentSnapshot => snapshot !== null)
                .map(snapshot => {
                    if(snapshot.exists()) {
                        return snapshot.data() as Session
                    }
                    return null
                })
                .filter((session): session is Session => session !== null)

            if(finalSessions.length > 0) {
                sessions.value = finalSessions
            }
        } catch (error) {
            console.error('Failed to fetch sessions:', error)
        }
    }


    const fetchHouse = async () => {
        try {
            const houseDocRef = doc(db, 'house_ids', props.houseId)
            const houseSnap = await getDoc(houseDocRef)
            if(houseSnap.exists()){
                house.value = houseSnap.data() as House
                await fetchSessions()
            }
        } catch (error) {
            console.error(error)
        }

    }




    onMounted(async () => {
        await fetchHouse()
        getAverageAmountPlayers()
        getAverageBuyIn()
        getPlayersAmountSessionPlayed()
        getAverageBB()
        getAverageSB()

    })


    return {
        divClass,
        titleClass,
        divSectorClass,
        pValueClass,
        pTitleClass,
        sessions,
        averageBB,
        averageSB,
        averageBuyIn,
        averageAmountPlayers,
        playersAmountSessionPlayed

    }
  }
})
</script>
