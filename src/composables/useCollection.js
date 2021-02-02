import { ref } from 'vue'
import { db } from '@/firebase/config'

const useCollection = (collection) => {
    const isPending = ref(false)
    const errorAddDoc = ref(null)

    // add a new document
    const addDoc = async (doc) => {
        errorAddDoc.value = null
        isPending.value = true
        try {
            const res = await db.collection(collection).add(doc)
            isPending.value = false
            return res
        }
        catch (err) {
            isPending.value = false
            errorAddDoc.value = err.message
        }
    }

    return { errorAddDoc, addDoc, isPending }

}

export default useCollection