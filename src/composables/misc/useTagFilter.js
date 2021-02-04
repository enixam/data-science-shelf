
import { ref } from "vue"

const selectedTags = ref([]);
const handleTag = (tag) => {
    // whenever user clicks on an existing tag, exlucde that tag
    if (selectedTags.value.includes(tag)) {
        selectedTags.value = selectedTags.value.filter(
            t => t !== tag
        );
        // when user want to add an tag
        // if it's "all", make all others unselectedTags
        // if it is not "all", make sure "all" is not also present in the array
    } else if (tag !== "all") {
        selectedTags.value.push(tag);
        if (selectedTags.value.includes("all")) {
            selectedTags.value = selectedTags.value.filter(
                t => t !== "all"
            );
        }
    } else {
        selectedTags.value = ["all"];
    }
    console.log("tag: ", selectedTags.value)
}

const useTagFilter = () => {
    return { selectedTags, handleTag }
}

export default useTagFilter