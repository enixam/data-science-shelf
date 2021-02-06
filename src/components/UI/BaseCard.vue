<template>
  <div class="single">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.single {
  display: flex;
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0 30px;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease-in-out;
}

.single:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  transform: scale(1.01);
}
</style>
