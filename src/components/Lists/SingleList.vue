<template>
  <router-link :to="{ name: 'listDetails', params: { lid: singleList.id } }">
    <base-card>
      <div class="thumbnail">
        <img :src="singleList.coverUrl" alt="" />
      </div>
      <div class="info">
        <h3>{{ singleList.title }}</h3>
        <div class="category">
          <p v-for="category in singleList.categories" :key="category">
            {{ category }}
          </p>
        </div>
        <div class="creator">
          <p>Created by {{ singleList.userName }}</p>
        </div>
      </div>
      <div class="book-number">
        <p>
          {{ singleList.books.length }}

          {{ singleList.books.length <= 1 ? "book" : "books" }}
        </p>
      </div>
    </base-card>
  </router-link>
</template>

<script>
import { ref } from "vue";

export default {
  props: ["singleList"],
  setup(props) {},
};
</script>

<style scoped>
.thumbnail {
  overflow: hidden;
  border-radius: 10px;
  margin-right: 20px;
}

.thumbnail img {
  display: block;
  max-width: 200px;
  max-height: 200px;
}

.category {
  font-size: 0.8rem;
  font-style: italic;
}

.creator {
  font-size: 0.7rem;
  margin-top: 20px;
}

.book-number {
  margin-left: auto;
}
</style>
