<template>
  <router-link :to="{ name: 'listDetails', params: { lid: singleList.id } }">
    <base-card>
      <div class="thumbnail">
        <img :src="singleList.coverUrl" alt="" />
      </div>
      <div class="info">
        <h3>{{ singleList.title }}</h3>
        <p>Created by {{ singleList.userName }}</p>
        <div class="category">
          <p>{{ singleList.category[1] }}</p>
        </div>
      </div>
      <div class="book-number">
        <p>
          {{ singleList.books.length }}

          {{ singleList.books.length ? "books" : "book" }}
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
  font-size: 12px;
  font-style: italic;
  margin-top: 20px;
}

.book-number {
  margin-left: auto;
}
</style>
