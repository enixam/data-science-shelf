import { ref } from 'vue'
import { db } from '@/firebase/config'

const useCollection = (collection) => {
    const isPending = ref(false)
    const error = ref(null)

    // add a new document
    const addDoc = async (doc) => {
        error.value = null
        isPending.value = true
        try {
            const res = await db.collection(collection).add(doc)
            isPending.value = false
            return res
        }
        catch (err) {
            isPending.value = false
            error.value = err.message
        }
    }

    return { error, addDoc, isPending }

}

export default useCollection