import { ref } from "vue"
import { db } from "@/firebase/config"



const listUserDocuments = async (collection, uid) => {
    const userDocuments = ref([])
    const collectionRef = db.collection(collection)
    try {
        const res = await collectionRef.where("userId", "==", uid).get()
        res.docs.forEach(doc => {
            userDocuments.value.push(doc.data())
        })
    } catch (err) {
        console.log("cannot list all documents belong to this user.")
    }
    return { userDocuments }
}

export default listUserDocuments