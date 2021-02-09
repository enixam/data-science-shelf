<template>
  <form @submit.prevent="handleSubmit">
    <the-dot v-if="isLoadPending">restoring list data </the-dot>
    <div class="error">{{ errorLoad }}</div>
    <label for="">Title</label>
    <input type="text" required v-model="title" />
    <label>Categories</label>
    <div class="categories">
      <span
        v-for="category in categories"
        :key="category"
        :class="['pill', { active: selectedCategories.includes(category) }]"
        @click="handleCategory(category)"
        >{{ category }}</span
      >
    </div>
    <label
      >Description
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
    <!-- tags -->
    <label for="">Tags</label>
    <div class="book-tags">
      <input type="text" v-model="tag" @keydown.enter.prevent="addTag" />
      <div class="tags">
        <div
          v-for="t in selectedTags"
          :key="t"
          class="enteredTag"
          v-if="selectedTags.length"
        >
          <span class="tag">#{{ t }}</span>
          <span class="material-icons" @click="removeTag(t)">
            clear
          </span>
        </div>
      </div>
    </div>
    <label>Cover Image</label>
    <input type="file" @change="handleFile" accept=".jpg, jpeg, .png, .svg" />

    <div class="buttons">
      <button v-if="!isPending">Save</button>
      <div v-else>
        <the-dot>Saving </the-dot>
      </div>
    </div>
    <div class="error">
      <div v-if="errorUploadImage">
        Failed to upload the image
      </div>
      <div v-if="errorUpdateDoc">
        Failed to submit the new list
      </div>
    </div>
  </form>
</template>

<script>
import { ref, computed, watch } from "vue";
import { timestamp } from "@/firebase/config";
import useDocument from "@/composables/useDocument";
import { useRouter } from "vue-router";
import useStorage from "@/composables/useStorage";
import getUser from "@/composables/auth/getUser";
import grow from "@/composables/misc/textAreaGrow";
import TagsInput from "@/components/Lists/TagsInput.vue";
import { getDocuments } from "@/composables/getDocuments";
import useCategoryFilter from "@/composables/misc/useCategoryFilter";
import categories from "@/composables/data/categories";

export default {
  props: ["lid"],
  components: {
    "tags-input": TagsInput,
  },
  setup(props) {
    const { error: errorLoad, documents: list } = getDocuments(
      "booklists",
      props.lid
    );
    const isLoadPending = computed(() => {
      if (list.value) return false;
      else return true;
    });
    const title = ref("");
    const description = ref("");
    const { selectedCategories, handleCategory } = useCategoryFilter();
    const file = ref(null);
    const useMarkdown = ref(false);

    // tags
    const tag = ref(null);
    const selectedTags = ref([]);
    const errorAddTag = ref(false);
    const addTag = () => {
      errorAddTag.value = false;
      if (!selectedTags.value.includes(tag.value)) {
        tag.value = tag.value.replace(/\s/g, ""); // remove all whitespace
        selectedTags.value.push(tag.value);
      } else {
        errorAddTag.value = true;
      }
      tag.value = "";
    };

    const removeTag = (t) => {
      selectedTags.value = selectedTags.value.filter((tag) => {
        return tag !== t;
      });
    };

    // when the list is fuly loaded, fill the blanks with previous values
    watch(list, () => {
      title.value = list.value.title;
      description.value = list.value.description;
      selectedCategories.value = list.value.categories;
      selectedTags.value = list.value.tags;
    });

    const router = useRouter();
    const user = getUser();
    const isPending = ref(false);

    // updating functions
    const { error: errorUpdateDoc, updateDoc } = useDocument(
      "booklists",
      props.lid
    );

    // image uploading functions
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

    // uploading new list object
    const handleSubmit = async () => {
      isPending.value = true;
      errorUpdateDoc.value = null;
      errorUploadImage.value = null;
      const newList = {
        title: title.value,
        categories: selectedCategories.value,
        description: description.value,
        tags: selectedTags.value,
        lastUpdatedAt: timestamp(),
      };
      if (file.value) {
        // for users who upload cover themselves
        await uploadImage(file.value);
        newList.coverUrl = url.value;
        newList.filePath = filePath.value;
      }
      if (!errorUploadImage.value) {
        // firebase update does not return anything
        await updateDoc(newList);
        isPending.value = false;
        if (!errorUpdateDoc.value) {
          router.push({ name: "listDetails", params: { lid: list.value.id } });
        } else {
          console.log(errorUpdateDoc.value);
        }
      } else {
        console.log(errorUploadImage.value);
      }
    };
    return {
      isLoadPending,
      errorLoad,
      title,
      description,
      selectedCategories,
      selectedTags,
      categories,
      handleCategory,
      addTag,
      removeTag,
      tag,
      handleSubmit,
      handleFile,
      handleCategory,
      errorUploadImage,
      errorUpdateDoc,
      isPending,
      grow,
      useMarkdown,
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

.book-tags {
  margin-bottom: 10px;
}

.enteredTag {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  margin: 10px 10px 0 0;
  color: #444;
  background: #ddd;
  padding: 8px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.material-icons {
  font-size: 14px;
  cursor: pointer;
  margin-left: 5px;
  color: #444;
}


</style>
