<template>
  <form @submit.prevent="handleSubmit">
    <input placeholder="Email" type="email" v-model="email" required />
    <input placeholder="Password" type="password" v-model="password" required />
    <div class="error" v-if="error">{{ error }}</div>
    <button v-if="!isPending">Log in</button>
    <the-dot v-else>Loading </the-dot>
    <div class="link" v-if="!isPending">
      Do not have an acount ?
      <router-link :to="{ name: 'Signup' }">Sign up</router-link> instead
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import useLogin from "@/composables/useLogin";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const { error, login, isPending } = useLogin();
    const router = useRouter();
    const handleSubmit = async () => {
      const res = await login(email.value, password.value);
      if (!error.value) {
        router.push({ name: "Home" });
      }
    };

    return { email, password, handleSubmit, error, isPending };
  },
};
</script>

<style scoped>
form a {
  text-decoration: underline;
  font-weight: bold;
}

.link {
  margin-top: 20px;
}
</style>
