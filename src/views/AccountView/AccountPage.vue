<template>
    <div class="flex flex-col font-bebas-neue">
        <div class="flex flex-row justify-end mr-4 mt-3" >
            <SignOutBarComponent> </SignOutBarComponent>
        </div>

        <div class="flex flex-row justify-between text-[2.5vw] mx-[4vw]">
            <div :class="[containerDivClass]">
                <p> Account Info </p>
                <div :class="[divClass]">
                    <p :class="[pClass]"> Username: </p>
                    <p :class="[pClass]"> {{ currUserPlayer?.username }} </p>
                </div>

                <div :class="[divClass]">
                    <p :class="[pClass]"> Email: </p>
                    <p :class="[pClass]"> {{ currUserPlayer?.email }} </p>
                </div>
                <div :class="[divClass]">
                    <p :class="[pClass]"> # Hosted House Games: </p>
                    <p :class="[pClass]"> {{ currUserPlayer?.houseGamesHosted.length }} </p>
                </div>
                <div :class="[divClass]">
                    <p :class="[pClass]"> # Hosted Sessions: </p>
                    <p :class="[pClass]"> {{ currUserPlayer?.sessionsHosted.length }} </p>
                </div>
                <div :class="[divClass]">
                    <p :class="[pClass]"> # Games Played: </p>
                    <p :class="[pClass]"> {{ currUserPlayer?.sessionsPlayedIds.length }} </p>
                </div>
                <div :class="[divClass]">
                    <p :class="[pClass]"> # Host Games Played: </p>
                    <p :class="[pClass]"> {{ currUserPlayer?.houseGamesPlayedIds.length }} </p>
                </div>
                <div :class="[divClass]">
                    <p :class="[pClass]"> Total Profit: </p>
                    <p :class="[pClass]"> {{ currUserPlayer?.buyOut - currUserPlayer?.buyIn }} </p>
                </div>
            </div>
            <div :class="[containerDivClass]">
                <p> Recent Sessions </p>
                <SessionsPlayedListComponent
                        :currUser="currUserPlayer"
                > </SessionsPlayedListComponent>
            </div>
            <div :class="[containerDivClass]">
                <div class="flex flex-row justify-between">
                    <p> Home Games </p>
                    <button class="text-button-text-color text-[1.5vw]"
                            @click="handleHomeClick"
                        >Search public house</button>

                </div>

                <HostedHouseListComponent
                        :currUser="currUserPlayer"
                > </HostedHouseListComponent>

                <button class="text-button-text-color text-[2vw]
                               button-custom-hover-class
                               px-2
                               py-3
                                "
                        @click="createHouseClick"
                    >
                    Create House

                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'vue-router'
import { House } from '@/models/HouseTypes'
import {PlayerMember} from '@/models/PlayerTypes'
import SignOutBarComponent from '@/components/AccountComponents/SignOutBarComponent.vue'
import HostedHouseListComponent from '@/components/HouseComponents/HostedHouseListComponent.vue'
import SessionsPlayedListComponent from '@/components/SessionComponents/SessionsPlayedListComponent.vue'

export default defineComponent({
  components: {
      SignOutBarComponent,
      HostedHouseListComponent,
      SessionsPlayedListComponent
  },
  name: 'AccountPage',
  setup(props, {emit}) {
    // Component logic can be added here
    const pClass = "text-[1.5vw]"
    const divClass = "flex flex-row justify-between"
    const containerDivClass = "w-1/3 mx-6"


    const houses: Ref<House[]> = ref([])

    const router = useRouter()

    const auth = getAuth();
    const db = getFirestore()

    const currUser = ref<User | null>(null)
    const currUserPlayer = ref<PlayerMember | null>(null);


    const handleHomeClick = () => {
        router.push({name: "HomePage"})
    }


    const createHouseClick = () => {
         router.push({
          name: "CreateHousePage",
          params: {
            userId: currUserPlayer.value?.uid ?? ''
          }
    });

    }

    onMounted(() => {
        onAuthStateChanged(auth, async (user) => {

            if (user) {
              if (!user.emailVerified) {
                router.push({ name: "EmailVerificationPage" });
                return;
              }

              // Fetch the user's data from Firestore
              const userDocRef = doc(db, 'users', user.uid);
              const userDocSnap = await getDoc(userDocRef);

              if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                currUserPlayer.value = {
                  username: userData.username  || '',
                  email: userData.email || '',
                  buyIn: userData.buyIn || 0,
                  buyOut: userData.buyOut || 0,
                  uid: userData.uid,
                  houseGamesPlayedIds: userData.houseGamesPlayedIds || [],
                  sessionsPlayedIds: userData.sessionsPlayedIds || [],
                  houseGamesHosted: userData.houseGamesHosted || [],
                  sessionsHosted: userData.sessionsHosted || [],
                  houseGamesPlayedIdsRef: userData.houseGamesPlayedIdsRef || [],
                  sessionsPlayedIdsRef: userData.sessionsPlayedIdsRef || [],
                  houseGamesHostedRef: userData.houseGamesHostedRef || [],
                  sessionsHostedRef: userData.sessionsHostedRef || []
                };
              } else {
                // If the user document doesn't exist, create a new PlayerMember object
                currUserPlayer.value = {
                  username: '',
                  email: user.email || '',
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
            } else {
              currUserPlayer.value = null;
            }
        })
    })


    return {
        pClass,
        divClass,
        containerDivClass,
         createHouseClick,
         currUserPlayer,
         handleHomeClick


    }
  },
})
</script>

