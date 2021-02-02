import { ref, watchEffect } from "vue"
import { db } from "@/firebase/config"


const getDocument = (collection, id) => {
    const document = ref(null)
    const error = ref(null)

    let documentRef = db.collection(collection).doc(id)

    const unsub = documentRef.onSnapshot(doc => {
        if (doc.data()) {
            document.value = { ...doc.data(), id: doc.id }
            error.value = null
        }
        else {
            error.value = "List does not exist."
        }
    }, err => {
        document.value = null
        error.value = err.message
    })

    watchEffect((onInvalidate) => {
        onInvalidate(() => unsub());
    });

    return { error, document }
}

export default getDocument