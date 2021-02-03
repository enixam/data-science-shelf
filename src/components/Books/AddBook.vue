<template>
  <div class="add-book">
    <button v-if="!showForm" @click="showForm = !showForm">
      Add a awesome book!
    </button>
    <form @submit.prevent="handleSubmit" v-else id="addForm">
      <label for="">Book Title *</label>
      <input type="text" v-model="title" required />
      <label for="">Review *</label>
      <textarea v-model="review" @input="grow" required></textarea>
      <label>Link </label>
      <input type="text" v-model="link" />
      <label>Author </label>
      <input type="text" v-model="author" />
      <div class="error" v-if="errorUpdateDoc">{{ errorUpdateDoc }}</div>
      <button v-if="!isPending">Add</button>
      <the-dot v-else>Add the new book</the-dot>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import grow from "@/composables/misc/textAreaGrow";
import useDocument from "@/composables/useDocument";

export default {
  props: ["list"],
  setup(props) {
    const showForm = ref(false);
    const title = ref("");
    const review = ref("");
    const link = ref("");
    const author = ref("");

    const { updateDoc, isPending, error: errorUpdateDoc } = useDocument(
      "booklists",
      props.list.id
    );

    const handleSubmit = async () => {
      const newBook = {
        id:
          "_" +
          Math.random()
            .toString(36)
            .substr(2, 9),
        title: title.value,
        review: review.value,
        link: link.value,
        author: author.value,
      };
      await updateDoc({
        // current books plus the new book
        books: [...props.list.books, newBook],
      });
      if (!errorUpdateDoc.value) {
        title.value = "";
        review.value = "";
        link.value = "";
        author.value = "";
        showForm.value = false;
      }
    };

    return {
      showForm,
      title,
      review,
      link,
      author,
      grow,
      handleSubmit,
      errorUpdateDoc,
      isPending,
    };
  },
};
</script>

<style scoped>
form {
  width: 100%;
  max-width: none;
}

button {
  display: block;
  margin: 20px auto;
  font-size: 18px;
}
</style>
