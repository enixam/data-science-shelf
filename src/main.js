import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "@/assets/main.css"
// markdown editor
import VueMarkdownEditor from '@kangc/v-md-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import enUS from '@kangc/v-md-editor/lib/lang/en-US';
VueMarkdownEditor.use(githubTheme);
VMdPreview.use(githubTheme);
VueMarkdownEditor.lang.use('en-US', enUS);
// global components
import BaseDialog from "@/components/UI/BaseDialog.vue"
import BaseCard from "@/components/UI/BaseCard"
import TheDot from "@/components/UI/TheDot.vue"
// firebasea authentication
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
            .use(VueMarkdownEditor)
            .use(VMdPreview)
            .mount('#app')
    }
})


