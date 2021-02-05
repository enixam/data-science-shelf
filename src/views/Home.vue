<template>
  <div class="home">
    <two-column>
      <template #sidebar>
        <div class="search">
          <search-bar @search="search"></search-bar>
        </div>
        <div class="category-filter" v-if="selectedCategories">
          <h3>Category</h3>
          <span
            v-for="(count, category) in categories"
            :key="category"
            @click="handleCategory(category)"
            :style="{ fontWeight: category === 'ALL' ? 'bold' : 'normal' }"
            :class="[
              'category',
              'pill',
              { active: selectedCategories.includes(category) },
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
            :style="{ fontWeight: tag === 'ALL' ? 'bold' : 'normal' }"
            :class="['tag', 'pill', { active: selectedTags.includes(tag) }]"
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
    const toLower = (item) => {
      if (typeof item === "string") {
        return item.toLowerCase();
      } else if (typeof item === "object") {
        return item.map((element) => element.toLowerCase());
      }
    };

    // search
    let keywords = ref("");
    const search = (kw) => {
      if (kw !== "") {
        keywords.value = kw.toLowerCase().split(" ");
      } else {
        // reset to empty
        keywords.value = "";
      }
    };

    let tagsLower;
    let categoriesLower;
    let titleLower;
    let selectedCategoriesLower;
    let selectedTagsLower;

    const isSearched = (list) => {
      return keywords.value.some((keyword) => {
        tagsLower = toLower(list.tags);
        categoriesLower = toLower(list.categories);
        titleLower = toLower(list.title);
        return (
          tagsLower.includes(keyword) ||
          categoriesLower.some((c) => c.includes(keyword)) ||
          titleLower.includes(keyword)
        );
      });
    };

    const isSelected = (list) => {
      if (
        selectedCategories.value.includes("ALL") ||
        !selectedCategories.value.length
      ) {
        if (selectedTags.value.includes("ALL") || !selectedTags.value.length) {
          return true;
        } else {
          selectedTagsLower = toLower(selectedTags.value);
          tagsLower = toLower(list.tags);
          return selectedTagsLower.some((t) => tagsLower.includes(t));
        }
      } else if (
        selectedTags.value.includes("ALL") ||
        !selectedTags.value.length
      ) {
        if (
          selectedCategories.value.includes("ALL") ||
          !selectedCategories.value.length
        ) {
          return true;
        } else {
          selectedCategoriesLower = toLower(selectedCategories.value);
          categoriesLower = toLower(list.categories);
          return selectedCategoriesLower.some((c) =>
            categoriesLower.includes(c)
          );
        }
      } else {
        selectedTagsLower = toLower(selectedTags.value);
        tagsLower = toLower(list.tags);
        selectedCategoriesLower = toLower(selectedCategories.value);
        categoriesLower = toLower(list.categories);
        return (
          selectedTagsLower.some((t) => tagsLower.includes(t)) ||
          selectedCategoriesLower.some((c) => categoriesLower.includes(c))
        );
      }
    };

    // return full data when
    // 1. Home component is mounted, or
    // 2. Both selectors include "ALL"
    let isFull = computed(() => {
      return (
        (!selectedTags.value.length && !selectedCategories.value.length) ||
        (selectedTags.value.includes("ALL") &&
          selectedCategories.value.includes("ALL"))
      );
    });

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
        if (isFull.value) {
          return bookLists.value;
        } else {
          // otherwise, filter lists based on selected tags and categories
          return bookLists.value.filter((list) => {
            return isSelected(list);
          });
        }
        // with search term
      } else if (bookLists.value && keywords.value !== "") {
        if (isFull.value) {
          return bookLists.value.filter((list) => {
            return isSearched(list);
          });
        } else {
          return bookLists.value.filter((list) => {
            return isSelected(list) && isSearched(list);
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
      search,
    };
  },
};
</script>

<style scoped>
.search {
  margin-bottom: 30px;
  margin-top: 15px;
}

h3 {
  margin-bottom: 20px;
}

.category-filter {
  margin-bottom: 60px;
}
</style>
