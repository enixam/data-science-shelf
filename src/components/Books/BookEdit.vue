<template>
  <form @submit.prevent="handleSubmit">
    <label>Title</label>
    <input type="text" v-model="title" required />
    <label
      >Review
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
      left-toolbar=""
      right-toolbar="preview"
      placeholder="supports github flavour markdown (i.e., **text** will be bold and ![]() inserts an image)"
    ></v-md-editor>
    <label>Link </label>
    <input type="url" v-model="link" />
    <label>Author </label>
    <input type="text" v-model="author" />
    <div class="buttons">
      <button>Save</button>
      <button @click.prevent="$emit('stopEdit')">Cancel</button>
    </div>
    <the-dot v-if="isPending">Saving </the-dot>
    <div class="error" v-if="error">{{ error }}</div>
  </form>
</template>

<script>
import { ref } from "vue";
import { timestamp } from "@/firebase/config";
import useDocument from "@/composables/useDocument";
import grow from "@/composables/misc/textAreaGrow";

export default {
  props: ["book", "list"],
  emits: ["stopEdit"],
  setup(props, context) {
    const book = props.book;
    const list = props.list;
    const otherBooks = list.books.filter((el) => el.id !== book.id);
    const title = ref(book.title);
    const review = ref(book.review);
    const link = ref(book.link);
    const author = ref(book.author);
    const useMarkdown = ref(false);
    const error = ref("");
    const {
      updateDoc: updateBook,
      isPending,
      error: errorUpdateBook,
    } = useDocument("booklists", list.id);

    const handleSubmit = async () => {
      console.log(review.value);
      const updatedBook = {
        id: book.id,
        title: title.value,
        review: review.value,
        link: link.value,
        author: author.value,
      };
      await updateBook({
        // current books plus the new book
        // also updaet list update time
        books: [updatedBook, ...otherBooks],
        lastUpdatedAt: timestamp(),
      });
      if (errorUpdateBook.value) {
        console.log(errorUpdateBook.value);
        error.value = "Failed to update the book.";
      } else {
        context.emit("stopEdit");
      }
    };

    return {
      title,
      review,
      link,
      author,
      useMarkdown,
      isPending,
      error,
      handleSubmit,
      grow,
    };
  },
};
</script>

<style scoped>
.buttons {
  display: flex;
  justify-content: center;
}
</style>
