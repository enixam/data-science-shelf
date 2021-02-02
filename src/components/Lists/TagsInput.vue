<template>
  <label>
    <slot name="inputPrompt"></slot>
  </label>
  <input type="text" v-model="tag" @keydown.enter.prevent="addTag" />
  <div class="error" v-if="errorAddTag">
    <slot name="errorMessage"></slot>
  </div>
  <div class="tags">
    <div v-for="t in tags" :key="t" class="enteredTag" v-if="tags.length">
      <span class="tag">#{{ t }}</span>
      <span class="material-icons" @click="removeTag(t)">
        clear
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  emits: ["tagEntered"],
  setup(props, context) {
    const tag = ref("");
    const tags = ref([]);
    const errorAddTag = ref(false);
    const addTag = () => {
      errorAddTag.value = false;
      if (!tags.value.includes(tag.value)) {
        tag.value = tag.value.replace(/\s/g, ""); // remove all whitespace
        tags.value.push(tag.value);
        context.emit("tagEntered", tags.value);
      } else {
        errorAddTag.value = true;
      }
      tag.value = "";
    };

    const removeTag = (t) => {
      tags.value = tags.value.filter((tag) => {
        return tag !== t;
      });
    };

    return { tag, tags, addTag, removeTag, errorAddTag };
  },
};
</script>

<style scoped>
input[type="text"] {
  transition: 180ms box-shadow ease-in-out;
}

input[type="text"]:focus {
  box-shadow: 0 0 0 3px rgba(199, 199, 199, 0.753);
}

.tags {
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
