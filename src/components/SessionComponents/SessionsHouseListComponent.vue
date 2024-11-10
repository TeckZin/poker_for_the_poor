<template>
    <div>
        <ul>
            <li class="text-[1.5vw] border border-white flex flex-row justify-between mb-5" v-for="session in sessions" :key="session.sessionId">
                <div flex="flex flex-col">
                <div :class="[divListClass]">
                    <p :class="[pListClass]" > Name: </p>
                    <p :class="[pListClass, 'mx-2']"> {{session.name}} </p>
                    <p :class="[pListClass]"> Date: </p>
                    <p :class="[pListClass, 'mx-2']"> {{session.date}} </p>
                </div>
                <div :class="[divListClass]">
                    <p :class="[pListClass]"> Session ID: </p>
                    <p :class="[pListClass]"> {{session.sessionId}} </p>
                </div>
                </div>
                <button class="text-button-text-color mr-4"
                        @click="handleViewMoreClick(session)"

                    > View More </button>

            </li>

        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref, PropType } from 'vue'
import { getFirestore, collection, getDoc, doc, Firestore } from "firebase/firestore";
import { useRoute, useRouter } from 'vue-router'
import { Session, createEmptySessions } from '@/models/SessionTypes'
import { House } from '@/models/HouseTypes'
import { Player } from '@/models/PlayerTypes'

export default defineComponent({
    components: {
    },
    props: {
        sessions: {
            type: Array as PropType<Session[]>,
            required: true
        }


    },
    name: 'SessionsHouseListComponent',
    setup(props, { emit }) {
        const route = useRoute();
        const router = useRouter()
        const db = getFirestore();
        const houseDivClass = "flex flex-row text-[2vw]"
        const housePClass = "mr-5"
        const divListClass = 'flex flex-row'
        const pListClass = 'mx-4'


        const sessions = ref(createEmptySessions(0))

        const viewMoreSessionClick = (session: Session) => {
            emit('selectedSession', session)

        }


        return {
            houseDivClass,
            housePClass,
            divListClass,
            pListClass,
            viewMoreSessionClick
        }
    }
})
</script>
