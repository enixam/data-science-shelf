import { ref } from "vue"
import { auth } from "@/firebase/config"

const error = ref(null)
const isPending = ref(false)

const login = async (email, password) => {
    error.value = null
    isPending.value = true
    try {
        const res = await auth.signInWithEmailAndPassword(email, password)
        if (!res) {
            throw Error("Incorrect login credentials")
        } else {
            error.value = null
            isPending.value = false
            return res
        }
    } catch (err) {
        isPending.value = false
        error.value = err.message
    }
}

const useLogin = () => {
    return { login, error, isPending }
}

export default useLogin