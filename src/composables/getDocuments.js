import { ref, watchEffect } from "vue"
import { db } from "@/firebase/config"


const getDocuments = (collection, id, ...conditions) => {
    const documents = ref(null)
    const error = ref(null)

    // get list details by list id
    if (id) {
        var documentRef = db.collection(collection).doc(id)
        var unsub = documentRef.onSnapshot(doc => {
            if (doc.data() && doc.data().createdAt) {
                documents.value = { ...doc.data(), id: doc.id }
                console.log(documents.value)
                error.value = null
            }
            else {
                error.value = "List does not exist or connection failed."
            }
        }, err => {
            documents.value = null
            error.value = err.message
        })

    } else {
        // get user profile by userId from the "users" collection
        var documentRef = db.collection(collection)
        conditions.forEach(condition => {
            documentRef = documentRef.where(...condition)
        })

        var unsub = documentRef.onSnapshot(snap => {
            let results = []
            snap.docs.forEach(doc => {
                // must wait for the server to create the timestamp & send it back
                doc.data() && results.push({ ...doc.data(), id: doc.id })
            })

            if (results.length === 1) {
                documents.value = results[0]
                console.log(documents.value)
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
    try {
        const res = await collectionRef.where("userId", "==", uid).get()
        res.docs.forEach(doc => {
            userDocuments.value.push({ ...doc.data() })
        })
    } catch (err) {
        console.log("cannot list all documents belong to this user.")
    }
    return { userDocuments }
}



export { getDocuments, getUserDocuments }