<template>
  <div class="error" v-if="error && !isPending">{{ error }}</div>
  <two-column v-if="list">
    <!-- book list metadata -->
    <template #sidebar
      ><div class="list-info">
        <div>
          <div class="cover">
            <img :src="list.coverUrl" alt="" />
            <button @click="editCover">Edit cover</button>
          </div>
          <h2>{{ list.title }}</h2>
          <div class="user">
            <p>Created by {{ list.userName }}</p>
          </div>

          <div class="icons">
            <span class="material-icons">
              thumb_up
            </span>
            <span
              class="material-icons"
              v-if="ownership"
              @click="showDialog = true"
            >
              delete
            </span>
            <the-dot v-if="isPending">Deleting list </the-dot>
            <div class="error" v-if="errorDeleteDoc">{{ errorDeleteDoc }}</div>
            <div class="error" v-if="errorDeleteImage">
              {{ errorDeleteImage }}
            </div>
          </div>
          <div class="description">
            <p>{{ list.description }}</p>
          </div>
        </div>
      </div></template
    >

    <!-- books -->
    <template #main>
      <div class="list-books">
        <div v-if="!list.books.length" class="no-book-message">
          This list currently has no book.
        </div>
        <add-book v-if="ownership" :list="list"></add-book>
        <single-book
          v-if="list.books.length"
          v-for="book in list.books"
          :singleBook="book"
          :ownership="ownership"
          :listId="id"
          :list="list"
        ></single-book>
      </div>
    </template>
  </two-column>
  <teleport to="body">
    <base-dialog
      v-if="showDialog"
      @cancel="showDialog = false"
      @confirm="handleDelete"
    >
      <template #header>Are you sure you want to delete this list?</template>
    </base-dialog>
  </teleport>
</template>

<script>
import { ref, computed } from "vue";
import getDocuments from "@/composables/getDocuments";
import getUser from "@/composables/auth/getUser";
import useDocument from "@/composables/useDocument";
import { useRouter } from "vue-router";
import useStorage from "@/composables/useStorage";
import AddBook from "@/components/Books/AddBook.vue";
import SingleBook from "@/components/Books/SingleBook.vue";
import TwoColumn from "@/components/Layout/TwoColumn.vue";

export default {
  props: ["lid"],
  components: {
    "add-book": AddBook,
    "single-book": SingleBook,
    "two-column": TwoColumn,
  },
  setup(props) {
    const { error, document: list } = getDocuments("booklists", props.lid);
    const currentUser = getUser();
    const router = useRouter();
    // dialog for deleting list
    const showDialog = ref(false);
    const isPending = ref(false);
    const {
      error: errorDeleteImage,
      deleteImage,
      listImages,
      files: images,
    } = useStorage();
    const { error: errorDeleteDoc, deleteDoc } = useDocument(
      "booklists",
      props.id
    );

    const handleDelete = async () => {
      showDialog.value = false;
      isPending.value = true;
      await deleteDoc();
      if (!errorDeleteDoc.value) {
        // redirecting immediately when list uses default cover
        if (!list.value.filePath) {
          isPending.value = false;
          router.push({ name: "Home" });
        }
        // when user upload a custom cover for the list in the first place
        // only delete cover from storage when the image hasn't been reused
        else {
          const { userDocuments: userLists } = await getUserDocuments(
            "booklists",
            user.value.uid
          );
          const sameImageNum = userLists.value.filter(
            (userList) => userList.coverUrl === list.value.coverUrl
          ).length;
          if (sameImageNum === 1) {
            await deleteImage(list.value.filePath);
            if (errorDeleteImage.value)
              errorDeleteImage.value =
                "The is an error deleting the image, need to delete it manually";
          }
          isPending.value = false;
          router.push({ name: "Home" });
        }
      }
    };

    const ownership = computed(() => {
      return (
        list.value &&
        currentUser.value &&
        currentUser.value.uid === list.value.userId
      );
    });

    return {
      error,
      list,
      ownership,
      errorDeleteDoc,
      errorDeleteImage,
      isPending,
      showDialog,
      handleDelete,
    };
  },
};
</script>

<style secoped>
.list-info div {
  text-align: center;
  position: sticky;
  top: 0;
}

.list-info h2 {
  text-transform: capitalize;
  font-size: 24px;
  margin-top: 10px;
}

.list-info p {
  margin-bottom: 20px;
}

.list-info .cover {
  overflow: hidden;
  border-radius: 20px;
  position: relative;
  padding: 20px;
  /* center cove img */
  display: flex;
  justify-content: center;
}

.list-info .cover img {
  display: block;
  min-width: 50%;
  min-height: 50%;
  max-width: 200%;
  max-height: 200%;
}

.user p {
  color: #999;
}

.description {
  text-align: left;
}

.icons span {
  cursor: pointer;
  margin-left: 10px;
}

.no-book-message {
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}
</style>
