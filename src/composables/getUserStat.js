import { ref } from "vue"
import { db } from "@/firebase/config"

const getUserStat = async (uid) => {
    const documentRef = db.collection("users").where("userId", "==", uid)
    const documents = await documentRef.get()
    let results = []
    documents.docs.forEach(doc => {
        if (doc.data()) {
            results.push({ ...doc.data(), id: doc.id })
        }
    })
    return results[0]
}

export default getUserStat