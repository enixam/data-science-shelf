<template>
  <div class="navbar">
    <nav>
      <span class="material-icons">
        scatter_plot
      </span>
      <h1>
        <router-link :to="{ name: 'Home' }">Data Science Shelf</router-link>
      </h1>
      <div class="links">
        <router-link :to="{ name: 'Create' }" class="btn"
          >Create list</router-link
        >
        <div v-if="user">
          <router-link
            :to="{ name: 'userLists', params: { uid: user.uid } }"
            class="btn"
            >{{ name }}'s list</router-link
          >
          <button @click="handleLogout" v-if="user">Log out</button>
        </div>
        <div v-else>
          <router-link :to="{ name: 'Login' }" class="btn">Log in</router-link>
          <router-link :to="{ name: 'Signup' }" class="btn"
            >Sign up</router-link
          >
        </div>
      </div>
    </nav>
  </div>
  <teleport to="body">
    <base-dialog
      v-if="error"
      :title="error"
      @confirmError="confirmError"
    ></base-dialog>
  </teleport>
</template>

<script>
import { useRouter } from "vue-router";
import useLogout from "@/composables/auth/useLogout";
import getUser from "@/composables/auth/getUser";
import { computed } from "vue";

export default {
  setup() {
    const router = useRouter();
    const { error, logout, isPending } = useLogout();
    const user = getUser();
    const name = computed(() => {
      if (user.value) return user.value.displayName;
    });
    const handleLogout = async () => {
      await logout();
      if (!error.value) {
        router.push({ name: "Home" });
      }
    };

    const confirmError = () => {
      error.value = null;
    };
    return { error, handleLogout, confirmError, isPending, user, name };
  },
};
</script>

<style scoped>
.navbar {
  padding: 16px 10px;
  margin-bottom: 60px;
  background: white;
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 100;
}

nav {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

nav h1 {
  margin-left: 10px;
}

h1 a:hover {
  color: rgba(64, 162, 175, 0.8);
}

nav .links {
  margin-left: auto;
  display: flex;
}

nav .links a,
button {
  margin-left: 16px;
  font-size: 14px;
}

.material-icons {
  color: rgba(15, 138, 155, 0.8);
}
</style>
