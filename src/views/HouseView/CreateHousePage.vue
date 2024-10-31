<template>
    <div class="flex flex-col font-bebas-neue ml-5">
            <div class="flex flex-row justify-between mt-3">
                <p class="text-[2.5vw]"> New House Game  </p>
                <SignOutBarComponent
                        class="mr-7"
                        > </SignOutBarComponent>
            </div>
            <div class="text-[2.5vw] flex flex-col items-center">
                <div :class="[divInputClass]">
                    <label> Name: </label>
                    <input v-model="newHouse.name" type="text"
                       :class="[inputClass]"
                    />
                </div>
                <div :class="[divInputClass]">
                    <label> Location: </label>
                    <input v-model="newHouse.locationValue" type="text"
                      :class="[inputClass]"
                    />
                </div>
                <div :class="[divInputClass]">
                    <label> Discription: </label>
                    <textarea v-model="newHouse.discription" type="text"
                     :class="[inputClass, 'text-[1.5vw] w-full h-40 max-h-60 min-h-40 overflow-hidden resize-y']"
                     />
                </div>
                <div class="flex flex-row justify-evenly w-full text-button-text-color mt-6">

                    <button
                            class="button-custom-hover-class px-7 py-1.5"
                            @click="handleBackClick"
                        > Back </button>
                    <button
                            class="button-custom-hover-class px-7 py-1.5"
                            @click="handleSubmitClick"
                        > Submit </button>

                </div>
                <p> {{errMessage}} </p>


            </div>





    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref } from 'vue'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, getFirestore, doc, updateDoc, arrayUnion} from 'firebase/firestore';
import { useRouter } from 'vue-router'
import { House, createEmptyHouse } from '@/models/HouseTypes'
import SignOutBarComponent from '@/components/AccountComponents/SignOutBarComponent.vue'

export default defineComponent({
  components: {
    SignOutBarComponent,
  },
  props: {
    userId: {
        type: String,
        required: true
    }

  },
  name: 'CreateHousePage',
  setup(props, {emit}) {
    const isLoggedIn = ref(false)
    const errMessage = ref('')
    const router = useRouter()
    const userUid = ref('')
     const newHouse = ref<House>(createEmptyHouse());


    const auth = getAuth()
    const db = getFirestore();


    const newHouseId = ref('')


    const divInputClass = "flex flex-row justify-between w-2/4 my-5"
    const inputClass = "border-b border-white bg-transparent text-white px-3 py-2 rounded pl-10 focus:outline-none focus:ring-2 focus:ring-blue-600"

    const handleLoggedInChange = (value: boolean) => {
        isLoggedIn.value = value
        if(!value) {
            router.push({ name: 'LoginSignUpPage', params: { accountActionType: 'login'}})
        }
    }

    const handleBackClick = () => {
        router.push({ name: 'AccountPage' })
    }

    const handleSubmitClick =  async () => {


        if(!newHouse.value.locationValue || !newHouse.value.discription || !newHouse.value.name) {
            errMessage.value = "fill all box"
            return
        }


        errMessage.value = ""
        newHouse.value.hostUid = userUid.value
        const updateUserHostedGame = async () => {
            const userDocRef = doc(db, 'users', userUid.value)
            const houseDocRef = doc(db, 'house_ids', newHouseId.value)

            updateDoc(userDocRef, {
                houseGamesHosted: arrayUnion(newHouseId.value)
            }).then(() => {
                errMessage.value = ''
            }).catch((error) => {
                errMessage.value = error.message
                return
            })

            updateDoc(userDocRef, {
                houseGamesHostedRef: arrayUnion(houseDocRef)
            }).then(() => {
                errMessage.value = ''
            }).catch((error) => {
                errMessage.value = error.message
                return
            })

            updateDoc(houseDocRef, {
                houseId: newHouseId.value
            }).then(() => {
                errMessage.value = ''
            }).catch((error) => {
                errMessage.value = error.message
                return
            })


        }


        const addNewHouse = async () => {
            addDoc(collection(db, 'house_ids'),
                newHouse.value
            ).then((data) => {
                newHouseId.value = data.id

                errMessage.value = ''
                updateUserHostedGame()

            }).catch((error) => {
                errMessage.value = error.message
                return

            })

        }
        await addNewHouse()
        router.push({ name: "AccountPage"})

    }

    onMounted(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {

                if (user.uid) {
                    userUid.value = user.uid
                }


            } else {

                router.push({ name: "AccountPage"})
            }

        })
    })



    return {
        divInputClass,
        inputClass,
        isLoggedIn,
        handleLoggedInChange,
        handleBackClick,
        handleSubmitClick,
        newHouse,
        errMessage,

    }
  },
})
</script>

