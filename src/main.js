import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "@/assets/main.css"
import BaseDialog from "@/components/UI/BaseDialog.vue"
import BaseCard from "@/components/UI/BaseCard"
import TheDot from "@/components/UI/TheDot.vue"

import { auth } from "@/firebase/config"


let app;

auth.onAuthStateChanged(() => {
    // global components
    if (!app) {
        app = createApp(App)
            .component("base-dialog", BaseDialog)
            .component("the-dot", TheDot)
            .component("base-card", BaseCard)
            .use(router)
            .mount('#app')
    }
})


