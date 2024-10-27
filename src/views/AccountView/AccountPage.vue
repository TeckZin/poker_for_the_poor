<template>
    <div class="flex flex-col font-bebas-neue">
        <div class="flex flex-row justify-between mr-4 mt-3" >
          <button class="text-[2.5vw] ml-6 text-button-text-color" @click="handleBackClick">
            back
          </button>
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
                <button class="text-[2vw]
                               px-2
                               py-3
                        text-button-text-color button-custom-hover-class "
                        @click="handleAccEdit"
                    >
                    Edit Account
                </button>
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
                    <button class="text-button-text-color text-[1.5vw]
                                    "
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
                               mt-5
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
import {PlayerMember, createEmptyPlayerMember,  createEmptyPlayer} from '@/models/PlayerTypes'
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

    const currUserPlayer = ref<PlayerMember>(createEmptyPlayerMember());


    const handleHomeClick = () => {
        router.push({name: "HomePage"})
    }
    const handleBackClick = () => {
      router.go(-1)
    }

    const handleAccEdit = () => {
        router.push({name: 'AccountEditPage'})
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
                currUserPlayer.value  = userData as PlayerMember


              } else {
                // If the user document doesn't exist, create a new PlayerMember object
                currUserPlayer.value = createEmptyPlayerMember()
                }
            } else {
                currUserPlayer.value = createEmptyPlayerMember()


            }
        })
    })


    return {
        pClass,
        divClass,
        containerDivClass,
         createHouseClick,
         currUserPlayer,
         handleHomeClick,
         handleBackClick,
         handleAccEdit



    }
  },
})
</script>

