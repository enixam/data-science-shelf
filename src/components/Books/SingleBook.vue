<template>
  <base-card>
    <!-- the book-info root container cancels the flex display on base-card -->
    <div class="book-info">
      <div class="title-author">
        <div class="title">
          <h3 v-if="book.link">
            <a :href="book.link"> {{ book.title }}</a>
          </h3>
          <h3 v-else>
            {{ book.title }}
          </h3>
        </div>
        <div class="author" v-if="book.author">by {{ book.author }}</div>
      </div>
      <div class="review">
        {{ book.review }}
      </div>
      <div class="icons" v-if="ownership">
        <span class="material-icons">
          mode_edit
        </span>
        <span class="material-icons" @click="showDialog = true">
          delete
        </span>
      </div>
      <div class="error" v-if="error">{{ error }}</div>
      <the-dot v-if="isPending">Deleting book </the-dot>
    </div>
  </base-card>
  <teleport to="body">
    <base-dialog
      v-if="showDialog"
      @cancel="showDialog = false"
      @confirm="handleDelete(book.id)"
    >
      <template #header>Are you sure you want to delete this book?</template>
    </base-dialog>
  </teleport>
</template>

<script>
import { ref, comptued } from "vue";
import { timestamp } from "@/firebase/config";
import useDocument from "@/composables/useDocument";
import { formatDistanceToNow } from "date-fns";

export default {
  props: ["book", "ownership", "lid", "list"],
  setup(props) {
    const { error, isPending, updateDoc } = useDocument("booklists", props.lid);
    const showDialog = ref(false);
    const handleDelete = async (id) => {
      showDialog.value = false;
      const books = props.list.books.filter((book) => book.id !== id);
      console.log(books);
      // deleting the book from the list
      // also update the list update time
      await updateDoc({ books: books, lastUpdatedAt: timestamp() });
      if (!error.value) {
        console.log("finished deleting the book!");
      }
    };

    const handleEdit = async () => {};

    return { handleEdit, handleDelete, error, isPending, showDialog };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;1,300&display=swap");

.book-info {
  width: 100%;
}

.title-author {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.title {
  text-transform: capitalize;
  margin-bottom: 10px;
  transition: transform 0.3s ease-in-out;
}

.review {
  text-align: left;
  font-family: Raleway, sans-serif;
}

h3 a {
  text-decoration: none;
  color: #328cc1;
  display: block;
}

h3 a:hover {
  transform: translateY(-5px);
}

.icons {
  display: flex;
  justify-content: flex-end;
}
</style>
