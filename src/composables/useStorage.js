import { storage } from "@/firebase/config"
import getUser from "@/composables/auth/getUser"
import { ref } from "vue"

const user = getUser()

const useStorage = () => {
    const error = ref(null)
    // public url firebase sends back
    const url = ref(null)
    const filePath = ref(null)

    const uploadImage = async (file) => {
        error.value = null
        filePath.value = `covers/${user.value.uid}/${file.name}`
        const storageRef = storage.ref(filePath.value)

        try {
            const res = await storageRef.put(file)
            url.value = await res.ref.getDownloadURL()
            return res
        } catch (err) {
            error.value = err.message
        }
    }

    const deleteImage = async (filePath) => {
        error.value = null
        const storageRef = storage.ref(filePath)
        try {
            await storageRef.delete()
        } catch (err) {
            error.value = err.message
        }
    }


    return { url, filePath, error, uploadImage, deleteImage }

}

export default useStorage