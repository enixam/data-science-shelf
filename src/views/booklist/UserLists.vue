<template>
  <two-column>
    <template #sidebar>
      <user-profile :userId="uid" :userLists="userLists"></user-profile>
    </template>
    <template #main>
      <the-dot v-if="isPending">Loading book lists </the-dot>
      <div class="erorr">{{ error }}</div>
      <div class="book-lists">
        <single-list
          v-for="singleList in userLists"
          :key="singleList.id"
          :singleList="singleList"
        ></single-list>
      </div>
    </template>
  </two-column>
</template>

<script>
import { computed } from "vue";
import { getDocuments } from "@/composables/getDocuments";
import SingleList from "@/components/Lists/SingleList.vue";
import UserProfile from "@/components/User/UserProfile.vue";
import TwoColumn from "@/components/Layout/TwoColumn.vue";

export default {
  props: ["uid"],
  components: {
    "single-list": SingleList,
    "two-column": TwoColumn,
    "user-profile": UserProfile,
  },
  setup(props) {
    const { error, documents: userLists } = getDocuments(
      "booklists",
      null,
      props.uid
    );

    const isPending = computed(() => {
      if (!userLists.value) return true;
      else return false;
    });

    return {
      userLists,
      error,
      isPending,
    };
  },
};
</script>

<style></style>
