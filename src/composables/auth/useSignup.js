import { ref } from "vue"
import { auth } from "@/firebase/config"
import useCollection from "@/composables/useCollection"

const error = ref(null)
const isPending = ref(false)

const signup = async (name, email, password) => {
    error.value = null
    isPending.value = true
    try {
        const res = await auth.createUserWithEmailAndPassword(email, password)
        if (!res) {
            throw new Error("Failed to start signup, this is most likely caused by slow network.")
        } else {
            await res.user.updateProfile({ displayName: name, photoURL: "https://picsum.photos/200" })
            const newUser = {
                userId: res.user.uid,
                displayName: name,
                upvotedOn: [],
                photoURL: "https://picsum.photos/200",
                numLists: 0,
                numBooks: 0,
                upvotes: 0
            }
            const { error: errorAddDoc, addDoc } = useCollection("users")
            await addDoc(newUser)
            if (errorAddDoc.value) {
                throw new Error("Failed to complete signup.")
            }
            else {
                error.value = null
                isPending.value = false
                return res
            }
        }
    } catch (err) {
        isPending.value = false
        error.value = err.message
    }
}

const useSignup = () => {
    return { error, signup, isPending }
}

export default useSignup