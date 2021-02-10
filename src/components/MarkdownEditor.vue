<template>
  <v-md-editor
    v-if="show"
    v-model="data"
    left-toolbar=""
    right-toolbar="preview"
    placeholder="supports github flavour markdown (i.e., **text** will be bold and the <img> tag inserts an image)"
  ></v-md-editor>
</template>

<script>
export default {
  props: ["show", "data"],
};
</script>

<style>
/* prevent word break in markdown preview */

.v-md-editor-preview {
  word-break: keep-all !important;
}

.v-md-editor-preview img {
  display: block;
  max-width: 300px;
  margin: 10px auto;
}

.v-md-textarea-editor {
  min-height: 150px !important;
}

.v-md-textarea-editor textarea {
  word-break: keep-all !important;
}
</style>
