<template>
  <the-dot v-if="isPending">Loading user information </the-dot>
  <div v-if="user" class="user-profile">
    <div class="error" v-if="errorGetUser">The user cannot be found.</div>
    <div class="thumbnail">
      <img :src="user.photoURL" alt="" />
    </div>
    <div class="user-name">
      <h3>
        {{ user.displayName }}
      </h3>
      <p>with {{ numLists }} lists and {{ numBooks }} books</p>
    </div>
    <form v-if="showForm" @submit.prevent="handleSubmit">
      <input
        required
        type="file"
        @change="handleFile"
        accept=".jpg, jpeg, .png, .svg"
      />
      <div class="error" v-if="errorUpdateUser">{{ errorUpdateUser }}</div>
      <div class="error" v-if="errorUploadAvatar">{{ errorUploadAvatar }}</div>
      <div class="buttons" v-if="!isSavePending">
        <button>Save</button>
        <button
          @click.prevent="handleSubmit((type = 'random'))"
          v-if="user.photoURL !== 'https://picsum.photos/200'"
        >
          Random
        </button>
        <button @click.prevent="showForm = false">Cancel</button>
      </div>
      <the-dot v-if="isSavePending">Saving </the-dot>
    </form>
    <button v-if="ownership && !showForm" @click="showForm = true">
      Update my avatar
    </button>
  </div>
</template>

<script>
import { getDocuments } from "@/composables/getDocuments";
import useDocument from "@/composables/useDocument";
import useStorage from "@/composables/useStorage";
import getUser from "@/composables/auth/getUser";
import { ref, computed, watch } from "vue";

export default {
  // props.userId: id of list owner
  // currentUser.uid id of list viewer
  props: ["userId", "userLists"],
  setup(props) {
    const { error: errorGetUser, documents: user } = getDocuments(
      "users",
      null,
      props.userId
    );
    const currentUser = getUser();
    const showForm = ref(false);
    const file = ref(null);
    const isSavePending = ref(false);
    let errorUpdateUser;
    let updateUser;
    // functions for updaing user name and avatar
    watch(user, () => {
      ({ error: errorUpdateUser, updateDoc: updateUser } = useDocument(
        "users",
        user.value.id // the doc id in "users" collection, not user id
      ));
    });

    const {
      error: errorUploadAvatar,
      filePath,
      url,
      uploadAvatar,
      deleteImage,
    } = useStorage();

    const ownership = computed(() => {
      if (currentUser.value && currentUser.value.uid === props.userId)
        return true;
      else false;
    });

    const isPending = computed(() => {
      if (user.value) return false;
      else return true;
    });
    const numLists = computed(() => {
      return props.userLists.length;
    });

    const numBooks = computed(() => {
      let s = 0;
      props.userLists.forEach((userList) => {
        s = s + userList.books.length;
      });
      return s;
    });

    const handleFile = (e) => {
      const selected = e.target.files[0];
      if (selected) {
        // if user cancels, selected will be undefined
        file.value = selected;
      } else file.value = null;
    };

    const handleSubmit = async (type = null) => {
      isSavePending.value = true;
      errorUpdateUser.value = false;
      errorUploadAvatar.value = false;
      if (type === "random") {
        const updatedUser = { photoURL: "https://picsum.photos/200" };
        await deleteImage(user.value.filePath);
        await updateUser(updatedUser);
        if (!errorUpdateUser.value) {
          isSavePending.value = false;
          showForm.value = false;
        } else {
          console.log(errorUpdateUser.value);
          isSavePending.value = false;
        }
      } else {
        const updatedUser = {};
        if (file.value) {
          await uploadAvatar(file.value);
          if (!errorUploadAvatar.value) {
            updatedUser.photoURL = url.value;
            updatedUser.filePath = filePath.value;
            await updateUser(updatedUser);
            if (!errorUpdateUser.value) {
              isSavePending.value = false;
              showForm.value = false;
            } else {
              console.log(errorUpdateUser.value);
              isSavePending.value = false;
            }
          } else {
            console.log(errorUploadAvatar.value);
            isSavePending.value = false;
          }
        }
      }
    };

    return {
      errorGetUser,
      user,
      numBooks,
      numLists,
      file,
      handleFile,
      handleSubmit,
      isPending,
      isSavePending,
      errorUpdateUser,
      errorUploadAvatar,
      ownership,
      showForm,
      handleFile,
    };
  },
};
</script>

<style scoped>
.user-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 130px;
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

.user-name {
  margin: 14px auto;
}

.user-name h3 {
  font-size: 1.2rem;
  text-align: center;
}

.user-name p {
  font-size: 0.7rem;
}

.buttons {
  display: flex;
  justify-content: center;
}
</style>
