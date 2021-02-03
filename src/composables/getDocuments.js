import { ref, watchEffect } from "vue"
import { db } from "@/firebase/config"


const getDocuments = (collection, id, ...conditions) => {
    const document = ref(null)
    const error = ref(null)
    // list details
    if (id) {
        var documentRef = db.collection(collection).doc(id)
        var unsub = documentRef.onSnapshot(doc => {
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
        // user profile
    } else {
        var documentRef = db.collection(collection)
        conditions.forEach(condition => {
            documentRef = documentRef.where(...condition)
        })
        var unsub = documentRef.onSnapshot(docs => {
            let results = []
            docs.forEach(doc => {
                results.push({ ...doc.data() })
            }
            )
            if (results.length === 1) {
                document.value = results[0]
            } else {
                document.value = results
            }
        }, err => {
            document.value = null
            error.value = err.message
        })
    }

    watchEffect((onInvalidate) => {
        onInvalidate(() => unsub());
    });

    return { error, document }
}




export default getDocuments