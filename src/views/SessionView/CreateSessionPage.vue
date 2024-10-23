<template>
    <SessionEditComponent
            :editFlag="false"
            :houseId="currHouseId">
    </SessionEditComponent>

</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref, computed, onMounted, watch } from 'vue'
import { collection, addDoc, getFirestore, doc, updateDoc, arrayUnion, getDoc, DocumentReference } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { Session } from '@/models/SessionTypes'
import { Player, PlayerMember } from '@/models/PlayerTypes'
import SessionEditComponent from '@/components/SessionComponents/SessionEditComponent.vue'

export default defineComponent({
  name: 'CreateSessionPage',
  components: {
    SessionEditComponent
  },
  props: {
    currHouseId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const db = getFirestore()
    const router = useRouter()
    const auth = getAuth()



    return {
    }
  }
})
</script>
