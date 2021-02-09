import { ref, watchEffect } from "vue"
import { db } from "@/firebase/config"


const getCollection = (collection, order_by = ["upvotes", "createdAt"], ...conditions) => {
    const documents = ref(null)
    const error = ref(null)

    // register the firestore collection reference
    let collectionRefAll = db.collection(collection).orderBy(...order_by)
    let collectionRef
    if (!conditions.length) {
        collectionRef = collectionRefAll
    } else {
        conditions.forEach(condition => {
            collectionRef = collectionRefAll.where(...condition)
        })
    }

    const unsub = collectionRef.onSnapshot(snap => {
        let results = []
        snap.docs.forEach(doc => {
            // must wait for the server to create the timestamp & send it back
            doc.data().createdAt && results.push({ ...doc.data(), id: doc.id })
        });
        // update values
        documents.value = results
        error.value = null
    }, err => {
        documents.value = null
        error.value = err.message
    })

    watchEffect((onInvalidate) => {
        onInvalidate(() => unsub());
    });

    return { error, documents }
}


export default getCollection