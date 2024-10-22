
<template>
    <div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, Ref, PropType, watch } from 'vue'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, DocumentReference, getDocs } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { House } from '@/models/HouseTypes'
import { PlayerMember } from '@/models/PlayerTypes'
import { Session } from '@/models/SessionTypes'


export default defineComponent({
  components: {
  },
  props: {
    currUser: {
        type: Object as PropType<PlayerMember>,
        required: true
    }

  },
  name: 'SessionsPlayedListComponent',
    setup(props, { emit }) {
        const errorMessage = ref('')
        const loading = ref('')
        const db = getFirestore()
        const router = useRouter()

        const sessions: Ref<Session[]> = ref([])

        const getSession = async (sessionRef: DocumentReference): Promise<Session | null> => {
            try {
                const sessionSnap = await getDoc(sessionRef)
                if (sessionSnap.exists()) {
                    return {
                        ...sessionSnap.data()
                    } as Session
                }
                return null
            } catch (error) {
                errorMessage.value = 'Failed to fetch one session'
                return null
            }
        }

       const getPlayedSessions = async () => {
            try {
                if (!props.currUser?.sessionsPlayedIdsRef) {
                    sessions.value = []
                    return
                }
                const sessionsPromises = props.currUser.sessionsPlayedIdsRef.map(ref =>
                    getSession(ref)
                )
                const results = await Promise.all(sessionsPromises)
                sessions.value = results.filter((session): session is Session => session !== null)
            } catch (error) {
                errorMessage.value = "Failed to fetch sessions"
                sessions.value = []
            }
        }

        watch(() => props.currUser, () => {
            getPlayedSessions()
        }, {immediate: true})

        return {
            sessions,


        }
      },
})
</script>

