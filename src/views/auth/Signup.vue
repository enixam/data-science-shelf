<template>
  <form @submit.prevent="handleSubmit">
    <input type="text" placeholder="Display name" v-model="name" required />
    <input type="email" placeholder="" v-model="email" required />
    <input type="password" v-model="password" required />
    <div class="error" v-if="error">{{ error }}</div>
    <button v-if="!isPending">Sign up</button>
    <the-dot v-else>Loading </the-dot>
    <div class="link" v-if="!isPending">
      Already registerd?
      <router-link :to="{ name: 'Login' }">Log in</router-link> instead
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import useSignup from "@/composables/auth/useSignup";
import { useRouter } from "vue-router";

export default {
  setup() {
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const { error, signup, isPending } = useSignup();
    const router = useRouter();
    const handleSubmit = async () => {
      const res = await signup(name.value, email.value, password.value);
      if (!error.value) {
        router.push({ name: "Home" });
      }
    };

    return { name, email, password, handleSubmit, error, isPending };
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
