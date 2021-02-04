<template>
  <div class="home">
    <two-column>
      <template #sidebar>
        <div class="category-filter" v-if="selectedCategories">
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
        <div class="tag-filter" v-if="selectedTags">
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
        <div class="search">
          <search-bar @search="search"></search-bar>
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
import useCategoryFilter from "@/composables/misc/useCategoryFilter";
import useTagFilter from "@/composables/misc/useTagFilter";
import Search from "@/components/Search.vue";
import { ref, computed, watch } from "vue";

export default {
  components: {
    "single-list": SingleList,
    "two-column": TwoColumn,
    "search-bar": Search,
  },
  setup() {
    const { error, documents: bookLists } = getCollection("booklists");
    const { selectedCategories, handleCategory } = useCategoryFilter();
    const { selectedTags, handleTag } = useTagFilter();
    // search
    let keywords = ref("");
    const search = (kw) => {
      if (kw !== "") {
        keywords.value = kw.split(" ");
      } else {
        keywords.value = kw;
      }
    };

    const isSearched = (list) => {
      return keywords.value.some((keyword) => {
        return (
          list.tags.includes(keyword) ||
          list.categories.some((c) => c.includes(keyword)) ||
          list.title.includes(keyword)
        );
      });
    };

    const isSelected = (list) => {
      if (
        selectedCategories.value.includes("all") ||
        !selectedCategories.value.length
      ) {
        if (selectedTags.value.includes("all")) {
          return true;
        } else {
          return selectedTags.value.some((t) => list.tags.includes(t));
        }
      } else if (
        selectedTags.value.includes("all") ||
        !selectedTags.value.length
      ) {
        if (selectedCategories.value.includes("all")) {
          return true;
        } else {
          return selectedCategories.value.some((c) =>
            list.categories.includes(c)
          );
        }
      } else {
        return (
          selectedTags.value.some((t) => list.tags.includes(t)) ||
          selectedCategories.value.some((c) => list.categories.includes(c))
        );
      }
    };

    // tag cloud
    const tags = computed(() => {
      if (bookLists.value) {
        let tagCount = count(bookLists.value, "tags");
        return tagCount.value;
      }
    });

    // category cloud
    const categories = computed(() => {
      if (bookLists.value) {
        let categoryCount = count(bookLists.value, "categories");
        return categoryCount.value;
      }
    });

    // show lists that meet the category, tag and search requirments
    const filteredLists = computed(() => {
      // no search term
      if (bookLists.value && keywords.value === "") {
        if (
          // return full data in either of the two condtions
          // when page first loaded, or
          // when both 'all' is clicked
          (!selectedTags.value.length && !selectedCategories.value.length) ||
          (selectedTags.value.includes("all") &&
            selectedCategories.value.includes("all"))
        ) {
          return bookLists.value;
        } else {
          // otherwise, filter lists based on selected tags and categories
          return bookLists.value.filter((list) => {
            return isSelected(list);
          });
        }
        // with search term
      } else if (bookLists.value) {
        if (
          (!selectedTags.value.length && !selectedCategories.value.length) ||
          (selectedTags.value.includes("all") &&
            selectedCategories.value.includes("all"))
        ) {
          return bookLists.value.filter((list) => {
            return isSearched(list);
          });
        } else {
          bookLists.value.filter(
            (list) => isSelected(list) || isSearched(list)
          );
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
      search,
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
