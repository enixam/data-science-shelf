<template>
  <form @submit.prevent="handleSubmit">
    <h2>Create new book list</h2>
    <label for="">Title *</label>
    <input type="text" required v-model="title" />
    <label>Pick categories *</label>
    <div class="categories">
      <span
        v-for="category in categories"
        :key="category"
        :class="['pill', { active: selectedCategories.includes(category) }]"
        @click="handleCategory(category)"
        >{{ category }}</span
      >
    </div>
    <label for=""
      >A short description
      <span class="use-markdown-prompt" @click="useMarkdown = !useMarkdown">{{
        useMarkdown ? "back to plain text" : "use Markdown"
      }}</span></label
    >
    <textarea
      v-if="!useMarkdown"
      v-model="description"
      @input="grow"
    ></textarea>
    <v-md-editor
      v-else
      v-model="description"
      height="300px"
      left-toolbar=""
      right-toolbar="preview"
    ></v-md-editor>

    <tags-input @tagEntered="updateTags">
      <template #inputPrompt>Press enter to add tags</template>
      <template #errorMessage>Tag already exists</template>
    </tags-input>
    <label
      >(Optional) Upload book list cover image, supports jpg, png and svg</label
    >
    <input type="file" @change="handleFile" accept=".jpg, jpeg, .png, .svg" />

    <div class="buttons">
      <button v-if="!isPending">Add new list</button>
      <div v-else>
        <the-dot>Saving </the-dot>
      </div>
    </div>
    <div class="error">
      <div v-if="errorUploadImage">
        Failed to upload the image
      </div>
      <div v-if="errorAddList">
        Failed to submit the new list
      </div>
    </div>
  </form>
</template>

<script>
import { ref, computed } from "vue";
import { timestamp } from "@/firebase/config";
import useCollection from "@/composables/useCollection";
import useDocument from "@/composables/useDocument";
import { getDocuments } from "@/composables/getDocuments";
import { useRouter } from "vue-router";
import useStorage from "@/composables/useStorage";
import getUser from "@/composables/auth/getUser";
import grow from "@/composables/misc/textAreaGrow";
import TagsInput from "@/components/Lists/TagsInput.vue";
import useCategoryFilter from "@/composables/misc/useCategoryFilter";
import categories from "@/composables/data/categories";

export default {
  components: {
    "tags-input": TagsInput,
  },
  setup() {
    const title = ref("");
    const description = ref("");
    const useMarkdown = ref(false);
    const file = ref(null);
    const isPending = ref(false);
    // add or remove categories
    const { selectedCategories, handleCategory } = useCategoryFilter();
    const selectedTags = ref([]);
    const router = useRouter();
    const user = getUser();

    // for updating existing tags
    const updateTags = (tags) => {
      selectedTags.value = tags;
    };
    // uploading list
    const { error: errorAddList, addDoc: addList } = useCollection("booklists");
    // for uploading image
    const {
      error: errorUploadImage,
      filePath,
      url,
      uploadImage,
    } = useStorage();
    const handleFile = (e) => {
      const selected = e.target.files[0];
      if (selected) {
        // if user cancels, selected will be undefined
        file.value = selected;
      } else file.value = null;
    };
    // for uploading the new book list object
    const handleSubmit = async () => {
      isPending.value = true;
      errorAddList.value = null;
      errorUploadImage.value = null;
      const newList = {
        title: title.value,
        categories: selectedCategories.value,
        description: description.value,
        userId: user.value.uid,
        userName: user.value.displayName,
        books: [],
        tags: selectedTags.value,
        upvotes: 0,
        createdAt: timestamp(),
        lastUpdatedAt: timestamp(),
      };
      if (file.value) {
        // for users who upload cover themselves
        await uploadImage(file.value);
        newList.coverUrl = url.value;
        newList.filePath = filePath.value;
      } else {
        // if user does not upload a cover, use the default image
        newList.coverUrl =
          "https://firebasestorage.googleapis.com/v0/b/dsbook-list.appspot.com/o/covers%2Fdefault.jpg?alt=media&token=63f7b267-b152-4cab-bcf6-e4f277304924";
        newList.filePath = null;
      }
      if (!errorUploadImage.value) {
        const res = await addList(newList);
        if (!errorAddList.value) {
          router.push({ name: "listDetails", params: { lid: res.id } });
        }
      } else {
        console.log(errorUploadImage.value);
      }
    };

    return {
      title,
      selectedCategories,
      categories,
      handleCategory,
      description,
      useMarkdown,
      updateTags,
      handleSubmit,
      handleFile,
      handleCategory,
      errorUploadImage,
      errorAddList,
      isPending,
      grow,
    };
  },
};
</script>

<style scoped>
form {
  max-width: 600px;
}

form h2 {
  margin-bottom: 5px;
}

textarea {
  transition: 180ms box-shadow ease-in-out;
  min-height: 50px;
  max-height: 150px;
}

textarea:focus {
  box-shadow: 0 0 0 3px rgba(199, 199, 199, 0.753);
}

input[type="text"] {
  transition: 180ms box-shadow ease-in-out;
}

input[type="text"]:focus {
  box-shadow: 0 0 0 3px rgba(199, 199, 199, 0.753);
}

button {
  margin-top: 20px;
}

.categories {
  margin: 5px 0 10px;
}

.categories .pill {
  font-size: 0.8px;
}
</style>
