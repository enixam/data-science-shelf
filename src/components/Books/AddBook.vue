<template>
  <div class="add-book">
    <button v-if="!showForm" @click="showForm = true">
      Add a awesome book!
    </button>
    <form v-else @submit.prevent="handleSubmit">
      <label>Book Title *</label>
      <input type="text" v-model="title" required />
      <label
        >Review *
        <span class="use-markdown-prompt" @click="useMarkdown = !useMarkdown">{{
          useMarkdown ? "back to plain text" : "use Markdown"
        }}</span>
      </label>
      <textarea
        v-if="!useMarkdown"
        v-model="review"
        @input="grow"
        required
      ></textarea>
      <v-md-editor
        v-else
        v-model="review"
        height="300px"
        left-toolbar=""
        right-toolbar="preview"
        required
      ></v-md-editor>
      <label>Link </label>
      <input type="url" v-model="link" />
      <label>Author </label>
      <input type="text" v-model="author" />
      <div class="error" v-if="errorUpdateDoc">{{ errorUpdateDoc }}</div>
      <div class="buttons">
        <button v-if="!isPending">Add</button>
        <button v-if="!isPending" @click.prevent="showForm = !showForm">
          Cancel
        </button>
      </div>
      <the-dot v-if="isPending">Add the new book</the-dot>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import grow from "@/composables/misc/textAreaGrow";
import useDocument from "@/composables/useDocument";
import { timestamp } from "@/firebase/config";

export default {
  props: ["list"],
  setup(props, context) {
    const showForm = ref(false);
    const title = ref("");
    const review = ref("");
    const link = ref("");
    const author = ref("");
    const useMarkdown = ref(false);

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
        // also updaet list update time
        books: [...props.list.books, newBook],
        lastUpdatedAt: timestamp(),
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
      useMarkdown,
    };
  },
};
</script>

<style scoped>
form {
  width: 100%;
  max-width: none;
}

.buttons {
  display: flex;
  justify-content: center;
}

button {
  display: block;
  margin: 20px auto;
  font-size: 18px;
}
</style>
