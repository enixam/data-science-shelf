<template>
  <div class="two-column">
    <div class="sidebar">
      <slot name="sidebar"></slot>
    </div>
    <div class="main">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.two-column {
  display: grid;
  grid-template-columns: 1fr 2fr;
  column-gap: 20px;
}
</style>
