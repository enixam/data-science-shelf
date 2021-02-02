import { ref } from "vue"
import { auth } from "@/firebase/config"

const error = ref(null)
const isPending = ref(false)

const signup = async (name, email, password) => {
    error.value = null
    isPending.value = true
    try {
        const res = await auth.createUserWithEmailAndPassword(email, password)
        if (!res) {
            throw Error("Could not complete signup, this is most likely due to a network problem")
        } else {
            await res.user.updateProfile({ displayName: name })
            error.value = null
            isPending.value = false
            return res
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