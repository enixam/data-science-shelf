<template>
  <base-card>
    <!-- the book-info root container cancels the flex display on base-card -->
    <div class="book-info">
      <div class="title-author">
        <div class="title">
          <h3 v-if="singleBook.link">
            <a :href="singleBook.link"> {{ singleBook.title }}</a>
          </h3>
          <h3 v-else>
            {{ singleBook.title }}
          </h3>
        </div>
        <div class="author" v-if="singleBook.author">
          by {{ singleBook.author }}
        </div>
      </div>
      <div class="review">
        {{ singleBook.review }}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
        dolorem, dolore laboriosam vel molestias saepe doloribus inventore, sed
        obcaecati voluptas laborum placeat! Veritatis sequi, necessitatibus
        praesentium placeat minus illo hic. Optio sed, perferendis quas
        exercitationem voluptate ipsam? Sapiente rerum assumenda quaerat autem
        sed, dolorum tempora deserunt dignissimos voluptatem eos accusantium
        nostrum consequuntur dolores accusamus ab est, amet non vel quas, fuga
        nisi unde ipsa. Labore nam voluptate dolorum autem ex facilis nulla et
        excepturi non consectetur cupiditate, dignissimos quam eum voluptatem.
        Sunt accusamus dolorum repellendus delectus facere deleniti earum harum
        laboriosam nam officia! Deserunt ex iusto veritatis dicta veniam
        placeat.
      </div>
      <div class="icons">
        <span class="material-icons">
          thumb_up
        </span>
        <span
          class="material-icons"
          v-if="ownership"
          @click="handleDelete(singleBook.id)"
        >
          delete
        </span>
      </div>
      <div class="error" v-if="error">{{ error }}</div>
      <the-dot v-if="isPending">Deleting book </the-dot>
    </div>
  </base-card>
</template>

<script>
import useDocument from "@/composables/useDocument";
export default {
  props: ["singleBook", "ownership", "listId", "list"],
  setup(props) {
    const { error, isPending, updateDoc } = useDocument(
      "booklists",
      props.listId
    );
    const handleDelete = async (id) => {
      const books = props.list.books.filter((book) => book.id !== id);
      await updateDoc({ books });
    };
    return { handleDelete, error, isPending };
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,300;0,400;1,300&display=swap");

.book-info {
  padding: 20px;
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
