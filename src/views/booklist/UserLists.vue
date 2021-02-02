<template>
  <two-column>
    <template #sidebar>
      <div class="user-info" v-if="user">
        <p>A photo</p>
        <p>{{ user.displayName }}</p>
        <p>uploaded {{ numLists }} lists with {{ numBooks }} in total</p>
      </div>
    </template>
    <template #main>
      <the-dot v-if="isPending"
        >Loading {{ user.displayName }}'s lists
      </the-dot>
      <div class="erorr">{{ error }}</div>
      <div class="book-lists">
        <single-list
          v-for="singleList in userList"
          :key="singleList.id"
          :singleList="singleList"
        ></single-list>
      </div>
    </template>
  </two-column>
</template>

<script>
import { computed, ref } from "vue";
import getCollection from "@/composables/getCollection";
import SingleList from "@/components/Lists/SingleList.vue";
import getUser from "@/composables/getUser";
import TwoColumn from "@/components/Layout/TwoColumn.vue";
import { auth } from "@/firebase/config";

export default {
  components: {
    "single-list": SingleList,
    "two-column": TwoColumn,
  },
  setup(props) {
    const user = getUser(); // people watching this list
    const { error, documents: userLists } = getCollection("booklists", [
      "userId",
      "==",
      user.value.uid,
    ]);

    const isPending = computed(() => {
      if (!userLists.value) return true;
      else return false;
    });

    const numLists = computed(() => {
      if (userLists.value) {
        return userLists.value.length;
      }
    });

    const numBooks = computed(() => {
      console.log("numBooks");
      if (userLists.value) {
        let s = 0;
        userLists.value.forEach((list) => {
          let s = s + list.books.length;
        });
        return s;
      }
    });

    return {
      userLists,
      error,
      isPending,
      user,
      numLists,
      numBooks,
    };
  },
};
</script>

<style></style>
