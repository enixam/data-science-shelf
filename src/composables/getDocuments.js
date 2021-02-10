import { ref, watchEffect } from "vue"
import { db } from "@/firebase/config"


const getDocuments = (collection, lid, uid) => {
    const documents = ref(null)
    const error = ref(null)
    let documentRef;
    let unsub;
    // get list details by list id
    if (lid) {
        documentRef = db.collection(collection).doc(lid)
        unsub = documentRef.onSnapshot(doc => {
            // must wait for the server to create the timestamp & send it back
            if (doc.data() && doc.data().createdAt) {
                documents.value = { ...doc.data(), id: doc.id }
                error.value = null
            }
            else {
                error.value = "List does not exist or connection failed."
            }
        }, err => {
            documents.value = null
            error.value = err.message
        })
    }
    else if (!lid && uid) {
        // get user profile by userId from the "users" collection
        documentRef = db.collection(collection).where("userId", "==", uid)
        unsub = documentRef.onSnapshot(snap => {
            let results = []
            snap.docs.forEach(doc => {
                doc.data() && results.push({ ...doc.data(), id: doc.id })
            })

            if (results.length === 1) {
                documents.value = results[0]
            } else {
                documents.value = results
            }
        }, err => {
            documents.value = null
            error.value = err.message
        })
    }

    watchEffect((onInvalidate) => {
        onInvalidate(() => unsub());
    });

    return { error, documents }

}


// only used for deleting a list, un-realtime
const getUserDocuments = async (collection, uid) => {
    const userDocuments = ref([])
    const collectionRef = db.collection(collection)
    const error = ref(null)
    try {
        const res = await collectionRef.where("userId", "==", uid).get()
        res.docs.forEach(doc => {
            userDocuments.value.push({ ...doc.data() })
        })
    } catch (err) {
        error.value = err.message
        console.log("cannot list all documents belong to this user.")
    }
    return { error, userDocuments }
}

export { getDocuments, getUserDocuments }