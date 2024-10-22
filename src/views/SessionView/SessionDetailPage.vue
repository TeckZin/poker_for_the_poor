

<template>
   <div class="font-bebas-neue ">
       detail page

   </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUpdated, PropType } from 'vue'
import { getFirestore, collection, getDocs, doc, Firestore, getDoc, setDoc, DocumentReference } from "firebase/firestore";
import { getAuth, User, onAuthStateChanged } from 'firebase/auth';
import { Player, PlayerMember } from '@/models/PlayerTypes';
import { Session } from '@/models/SessionTypes';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {

  },

  props: {
    session: {
        type: Object as PropType<Session>,
        required: true

    },
    sessionId: {
        type: String,
        required: true

    }


  },
  name: 'SessionDetailPage',
  setup() {
    // Component logic can be added here
    const auth = getAuth()
    const db = getFirestore();
    const router = useRouter()

    return {
    }
  },
})
</script>

