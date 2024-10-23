<template>
      <SessionEditComponent
       :editFlag="true" :sessionId="sessionId">
      </SessionEditComponent>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, Ref, computed, onMounted, watch } from 'vue'
import { collection, addDoc, getDoc, getFirestore, doc, updateDoc, arrayUnion,DocumentReference } from 'firebase/firestore'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { Session } from '@/models/SessionTypes'
import { Player, PlayerMember } from '@/models/PlayerTypes'
// import SignOutBarComponent from '@/components/AccountComponents/SignOutBarComponent.vue'
import SessionEditComponent from '@/components/SessionComponents/SessionEditComponent.vue'

export default defineComponent({
  name: 'EditSessionPage',
  components: {
    SessionEditComponent
  },
  props: {
    sessionId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    return {}
  }
})
</script>
