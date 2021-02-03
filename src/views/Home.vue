<template>
  <div class="home">
    <two-column>
      <template #sidebar>
        <div class="category-filter">
          <h3>Category</h3>
          <span
            v-for="(count, category) in categories"
            :key="category"
            @click="handleCategory(category)"
            :style="{ fontWeight: category === 'all' ? 'bold' : 'normal' }"
            :class="[
              'category',
              'pill',
              { active: selectedCategories.includes(category) },
              { active: category === 'all' && selectedCategories.length === 0 },
            ]"
          >
            {{ category }} {{ count }}
          </span>
        </div>
        <div class="tag-filter">
          <h3>Tag</h3>
          <span
            v-for="(count, tag) in tags"
            :key="tag"
            @click="handleTag(tag)"
            :style="{ fontWeight: tag === 'all' ? 'bold' : 'normal' }"
            :class="[
              'tag',
              'pill',
              { active: selectedTags.includes(tag) },
              { active: tag === 'all' && selectedTags.length === 0 },
            ]"
          >
            {{ tag }} {{ count }}
          </span>
        </div>
      </template>
      <template #main>
        <the-dot v-if="isPending">Loading data </the-dot>
        <div class="error" v-if="error">{{ error }}</div>
        <div class="book-lists">
          <single-list
            v-for="singleList in filteredLists"
            :key="singleList.id"
            :singleList="singleList"
          ></single-list>
        </div>
      </template>
    </two-column>
  </div>
</template>

<script>
import SingleList from "@/components/Lists/SingleList.vue";
import getCollection from "@/composables/getCollection";
import TwoColumn from "@/components/Layout/TwoColumn.vue";
import count from "@/composables/misc/count";
import useHandleSelect from "@/composables/misc/useHandleSelect";
import { ref, computed } from "vue";

export default {
  components: {
    "single-list": SingleList,
    "two-column": TwoColumn,
  },
  setup() {
    const { error, documents: bookLists } = getCollection("booklists");
    const {
      selected: selectedCategories,
      handleSelect: handleCategory,
    } = useHandleSelect();
    // tag cloud
    const {
      selected: selectedTags,
      handleSelect: handleTag,
    } = useHandleSelect();
    // category cloud

    const tags = computed(() => {
      if (bookLists.value) {
        let tagCount = count(bookLists.value, "tags");
        return tagCount.value;
      }
    });

    const categories = computed(() => {
      if (bookLists.value) {
        let categoryCount = count(bookLists.value, "category");
        return categoryCount.value;
      }
    });

    const filteredLists = computed(() => {
      if (bookLists.value) {
        if (
          !selectedTags.value.length ||
          !selectedCategories.value.length ||
          selectedTags.value.includes("all") ||
          selectedCategories.value.includes("all")
        ) {
          return bookLists.value;
        } else {
          return bookLists.value.filter((list) => {
            return (
              selectedTags.value.some((tag) => list.tags.includes(tag)) ||
              selectedCategories.value.some((category) =>
                list.category.includes(category)
              )
            );
          });
        }
      }
    });

    const isPending = computed(() => {
      if (bookLists.value) return false;
      else return true;
    });

    return {
      error,
      bookLists,
      filteredLists,
      isPending,
      tags,
      categories,
      selectedTags,
      selectedCategories,
      handleTag,
      handleCategory,
    };
  },
};
</script>

<style scoped>
h3 {
  margin-bottom: 20px;
}

.category-filter {
  margin-bottom: 60px;
}
</style>
