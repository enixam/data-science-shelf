<template>
  <two-column>
    <template #sidebar> </template>
    <template #main>
      <the-dot v-if="isPending">Loading lists </the-dot>
      <single-list
        v-for="list in filteredLists"
        :key="list.id"
        :singleList="list"
      ></single-list>
    </template>
  </two-column>
</template>

<script>
import getCollection from "@/composables/getCollection";
import useTags from "@/composables/useTags";
import SingleList from "@/components/Lists/SingleList.vue";
import TwoColumn from "@/components/Layout/TwoColumn.vue";
import { ref, computed } from "vue";

export default {
  components: {
    "single-list": SingleList,
    "two-column": TwoColumn,
  },
  setup() {
    const selectedTag = ref("all");
    const { error, documents: booklists } = getCollection("booklists");
    const tags = computed(() => {
      if (booklists.value) {
        let allTags = useTags(booklists.value);
        return allTags.value;
      }
    });

    const filteredLists = computed(() => {
      if (selectedTag.value === "all") {
        return booklists.value;
      } else {
        return booklists.value.filter((list) => {
          return list.tags.includes(selectedTag.value);
        });
      }
    });

    const selectTag = (tag) => {
      selectedTag.value = tag;
    };

    const isPending = computed(() => {
      if (booklists.value) return false;
      else return true;
    });

    return {
      booklists,
      tags,
      filteredLists,
      selectTag,
      selectedTag,
      isPending,
    };
  },
};
</script>

<style scoped></style>
