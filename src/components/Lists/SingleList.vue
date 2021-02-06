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
        <div class="upvotes">
          <span :class="['material-icons', { upvoted: hasUpvoted }]">
            thumb_up
          </span>
          <span class="num-upvotes">{{ singleList.upvotes }}</span>
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
import { ref, computed, watchEffect } from "vue";
import getUserStat from "@/composables/getUserStat";
import getUser from "@/composables/auth/getUser";

export default {
  props: ["singleList"],
  setup(props) {
    const hasUpvoted = ref(true);
    const stopWatch = watchEffect(() => {
      const currentUser = getUser();
      const userStat = ref(null);
      if (currentUser.value) {
        getUserStat(currentUser.value.uid).then((data) => {
          userStat.value = data;
          console.log("list id", props.singleList.id);
          console.log("upvotedOn", userStat.value.upvotedOn);
          hasUpvoted.value = userStat.value.upvotedOn.includes(
            props.singleList.id
          );
          console.log(hasUpvoted.value);
        });
      }
    });

    stopWatch();

    return { hasUpvoted };
  },
};
</script>

<style scoped>
.info {
  display: flex;
  flex-direction: column;
}

.info h3 {
  text-transform: capitalize;
}

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

.book-number {
  margin-left: auto;
}

.upvotes {
  display: flex;
  align-items: flex-end;
  margin-top: auto;
  color: var(--secondaray);
}

.upvoted {
  color: indigo;
}

.num-upvotes {
  margin-left: 5px;
}
</style>
