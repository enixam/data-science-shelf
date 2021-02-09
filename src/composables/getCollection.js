import { ref, watchEffect } from "vue"
import { db } from "@/firebase/config"


const getCollection = (collection, limit = null, orderConfig = { createdAt: "desc", upvotes: "desc" }) => {
    const documents = ref(null)
    const error = ref(null)

    // register the firestore collection reference
    let collectionRefAll = db.collection(collection);
    let collectionRef;
    if (orderConfig) {
        for (let variable in orderConfig) {
            console.log(variable, orderConfig[variable])
            collectionRef = collectionRefAll.orderBy(variable, orderConfig[variable])
        }
    }
    if (limit) {
        collectionRef = collectionRef.limit(limit)
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