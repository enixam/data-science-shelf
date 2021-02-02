<template>
  <div class="backdrop" @click="$emit('cancel')"></div>
  <dialog open>
    <header>
      <slot name="header">
        <h2>{{ title }}</h2>
      </slot>
    </header>
    <section name="description" v-if="$slots.description">
      <slot></slot>
    </section>
    <menu>
      <slot name="action">
        <button @click="$emit('confirm')">Yes</button>
        <button @click="$emit('cancel')">No</button>
      </slot>
    </menu>
  </dialog>
</template>

<script>
export default {
  props: ["title"],
};
</script>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

dialog {
  position: fixed;
  top: 40vh;
  width: 40%;
  max-width: 800px;
  z-index: 100;
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 0;
  margin: 0 auto;
  overflow: hidden;
}

header {
  background-color: var(--bg-color);
  color: var(--primary);
  width: 100%;
  padding: 1rem;
}

header h2 {
  margin: 0;
}

section {
  padding: 1rem;
}

menu {
  padding: 0.5rem;
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

button + button {
  margin-left: 5px;
}
</style>
