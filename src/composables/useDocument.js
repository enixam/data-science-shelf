import { db } from "@/firebase/config"
import { ref } from "vue"

const useDocument = (collection, id) => {
    let error = ref(null)
    let isPending = ref(false)

    let docRef = db.collection(collection).doc(id)

    const deleteDoc = async () => {
        error.value = null
        isPending.value = true
        try {
            const res = await docRef.delete()
            isPending.value = false
            return res
        }
        catch (err) {
            isPending.value = false
            error.value = err.message
        }
    }


    const updateDoc = async (updates) => {
        error.value = null
        isPending.value = true
        try {
            docRef.update(updates)
            isPending.value = false
        }
        catch (err) {
            isPending.value = false
            error.value = err.message
        }
    }

    return { error, isPending, deleteDoc, updateDoc }
}

export default useDocument