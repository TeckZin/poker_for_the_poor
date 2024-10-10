<template>
    <div class="flex flex-col font-bebas-neue">
        <div class="flex flex-row justify-end mr-4 mt-3" >
            <SignOutBarComponent> </SignOutBarComponent>
        </div>

        <div class="flex flex-row justify-between text-[2.5vw] mx-[4vw]">
            <div :class="[containerDivClass]">
                <p> Account Info </p>

                <div :class="[divClass]">
                    <p :class="[pClass]"> Email: </p>
                    <p :class="[pClass]"> {{ email }} </p>
                </div>
                <div :class="[divClass]">
                    <p :class="[pClass]"> # Hosted House Games: </p>
                    <p :class="[pClass]"> {{ numberHostedGames }} </p>
                </div>
                <div :class="[divClass]">
                    <p :class="[pClass]"> # Hosted Sessions: </p>
                    <p :class="[pClass]"> {{ numberHostedSession }} </p>
                </div>
                <div :class="[divClass]">
                    <p :class="[pClass]"> # Games Played: </p>
                    <p :class="[pClass]"> {{ numberGamesPlayed }} </p>
                </div>
                <div :class="[divClass]">
                    <p :class="[pClass]"> # Host Games Played: </p>
                    <p :class="[pClass]"> {{ numberHostGames }} </p>
                </div>
                <div :class="[divClass]">
                    <p :class="[pClass]"> Total Profit: </p>
                    <p :class="[pClass]"> {{ totalProfit }} </p>
                </div>
            </div>
            <div :class="[containerDivClass]">
                <p> Sessions </p>
            </div>
            <div :class="[containerDivClass]">
                <p> Home Games </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'vue-router'
import SignOutBarComponent from '../components/SignOutBarComponent.vue'

export default defineComponent({
  components: {
      SignOutBarComponent,
  },
  name: 'AccountPage',
  setup(props, {emit}) {
    // Component logic can be added here
    const pClass = "text-[1.5vw]"
    const divClass = "flex flex-row justify-between"
    const containerDivClass = "w-1/3 mx-6"
    const email = ref('example@example.com')
    const numberHostedGames = ref(0)
    const numberHostedSession = ref(0)
    const numberGamesPlayed = ref(0)
    const numberHostGames = ref(0)
    const totalProfit = ref(0)
    const numberBuyIns = ref(0)
    const numberBuyOuts = ref(0)


    const router = useRouter()

    const auth = getAuth();

    const currUser = ref<User | null>(null)

    onMounted(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                currUser.value = user
                email.value = user.email as string
                if (!user.emailVerified) {
                    router.push({ name: "EmailVerificationPage"})
                }

            }

        })
    })


    return {
        pClass,
        divClass,
        containerDivClass,
        email,
        numberHostedGames,
        numberHostedSession,
        numberGamesPlayed,
        numberHostGames,
        totalProfit,
        numberBuyIns,
        numberBuyOuts,

    }
  },
})
</script>

