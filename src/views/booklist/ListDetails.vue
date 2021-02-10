<template>
  <div class="error" v-if="error && !isPending">{{ error }}</div>
  <two-column v-if="list">
    <!-- book list metadata -->
    <template #sidebar>
      <div class="list-info">
        <div class="cover">
          <img :src="list.coverUrl" alt="" />
        </div>
        <h2>{{ list.title }}</h2>
        <div class="user-update">
          <p>
            Created by
            <router-link
              :to="{ name: 'userLists', params: { uid: list.userId } }"
              >{{ list.userName }}</router-link
            >
          </p>
          <p>updated {{ lastUpdatedAt }} ago</p>
          <div class="icons">
            <div class="upvotes">
              <span
                :class="['material-icons', { upvoted: hasUpvoted }]"
                @click="upvote"
              >
                thumb_up
              </span>
              <span class="num-upvotes">
                {{ list.upvotes }}
              </span>
            </div>
            <router-link
              :to="{ name: 'listEdit', params: { lid } }"
              v-if="ownership"
            >
              <span class="material-icons">mode_edit</span>
            </router-link>
            <span
              class="material-icons"
              v-if="ownership"
              @click="showDialog = true"
            >
              delete
            </span>
            <div class="error" v-if="errorDeleteDoc">{{ errorDeleteDoc }}</div>
            <div class="error" v-if="errorDeleteImage">
              {{ errorDeleteImage }}
            </div>
          </div>
          <the-dot v-if="isPending">Deleting list </the-dot>
        </div>
        <div class="description">
          <v-md-preview
            v-if="list.description"
            :text="list.description"
          ></v-md-preview>
        </div>
      </div>
    </template>

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
          :book="book"
          :ownership="ownership"
          :lid="lid"
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
  <teleport to="body">
    <base-dialog
      v-if="showDialogUpvote"
      @confirm="showDialogUpvote = false"
      @cancel="showDialogUpvote = false"
      :onlyConfirm="true"
    >
      <template #header>You have already upvoted this list.</template>
      <template #confirmWords>Ok</template>
    </base-dialog>
  </teleport>
</template>

<script>
import { ref, computed, watchEffect } from "vue";
import { getDocuments, getUserDocuments } from "@/composables/getDocuments";
import getUser from "@/composables/auth/getUser";
import getUserStat from "@/composables/getUserStat";
import useDocument from "@/composables/useDocument";
import { useRouter } from "vue-router";
import useStorage from "@/composables/useStorage";
import AddBook from "@/components/Books/AddBook.vue";
import SingleBook from "@/components/Books/SingleBook.vue";
import TwoColumn from "@/components/Layout/TwoColumn.vue";
import { formatDistanceToNow } from "date-fns";

export default {
  props: ["lid"],
  components: {
    "add-book": AddBook,
    "single-book": SingleBook,
    "two-column": TwoColumn,
  },
  setup(props) {
    const { error, documents: list } = getDocuments("booklists", props.lid);
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
    // deleting and upvoting
    const {
      error: errorDeleteDoc,
      deleteDoc,
      updateDoc: updateList,
    } = useDocument("booklists", props.lid);

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
            list.value.userId
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

    const lastUpdatedAt = computed(() => {
      if (list.value && list.value.lastUpdatedAt) {
        return formatDistanceToNow(list.value.lastUpdatedAt.toDate());
      }
    });

    // upvotes

    const hasUpvoted = ref(false);
    const userStat = ref(null);
    let updateUser;
    if (currentUser.value) {
      getUserStat(currentUser.value.uid).then((data) => {
        userStat.value = data;
        hasUpvoted.value = userStat.value.upvotedOn.includes(props.lid);
        const { updateDoc } = useDocument("users", userStat.value.id);
        updateUser = updateDoc;
      });
    }

    const showDialogUpvote = ref(false);

    const upvote = async () => {
      if (hasUpvoted.value) {
        showDialogUpvote.value = true;
      } else {
        userStat.value.upvotedOn.push(props.lid);
        await updateList({ upvotes: list.value.upvotes + 1 });
        await updateUser({
          upvotedOn: userStat.value.upvotedOn,
        });
        hasUpvoted.value = true;
      }
    };

    return {
      error,
      list,
      ownership,
      errorDeleteDoc,
      errorDeleteImage,
      isPending,
      showDialog,
      showDialogUpvote,
      handleDelete,
      lastUpdatedAt,
      upvote,
      hasUpvoted,
    };
  },
};
</script>

<style secoped>
.list-info h2 {
  text-transform: capitalize;
  font-size: 24px;
  margin-top: 10px;
  text-align: center;
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
  min-width: 30%;
  min-height: 30%;
  max-width: 150%;
  max-height: 200%;
}

.description {
  text-align: left;
}

.user-update {
  text-align: center;
}

.user-update p {
  color: #999;
}

/* link to user page */
.user-update a {
  color: var(--blue);
}

.description {
  text-align: left;
}

/* icons */
.icons {
  display: flex;
  justify-content: center;
}

.icons span {
  display: block;
  cursor: pointer;
  margin-left: 10px;
}

.no-book-message {
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}
</style>
