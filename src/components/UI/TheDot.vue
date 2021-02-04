<template>
  <div id="wave">
    <slot></slot>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
</template>

<style scoped>
#wave {
  text-align: center;
  width: 100%;
  /* the same height as textarea */
  height: 41.6px;
  padding: 10px;
  margin-bottom: 6px;
  color: var(--blue);
}
#wave .dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-right: 3px;
  background: var(--blue);
  animation: wave 1.3s linear infinite;
}
#wave .dot:nth-child(2) {
  animation-delay: -1.1s;
}
#wave .dot:nth-child(3) {
  animation-delay: -0.9s;
}

@keyframes wave {
  0%,
  60%,
  100% {
    transform: initial;
  }
  30% {
    transform: translateY(-15px);
  }
}
</style>
