<template>
  <the-dot v-if="isPending">Loading user information </the-dot>
  <div v-if="user" class="user-profile">
    <div class="user-photo">
      <img :src="user.photoURL" alt="" />
    </div>
    <div class="user-name">
      <h3>{{ user.displayName }}</h3>
    </div>
    <div class="icons"></div>
  </div>
</template>

<script>
import getDocuments from "@/composables/getDocuments";
import getUser from "@/composables/auth/getUser";
import { ref, computed } from "vue";

export default {
  props: ["userId"],
  setup(props) {
    const { error, document: user } = getDocuments("users", null, [
      "userId",
      "==",
      props.userId,
    ]);
    const currentUser = getUser();
    const ownership = computed(() => {
      if (currentUser.value.uid === props.userId) {
        consoel.log("I am viewing my own lists");
      }
    });
    const isPending = computed(() => {
      if (user.value) return false;
      else return true;
    });

    return { user, isPending };
  },
};
</script>

<style scoped>
.user-name h3 {
  font-size: 1.2rem;
  text-align: center;
}
</style>
