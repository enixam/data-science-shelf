
import { ref } from "vue"

const selectedTags = ref([]);
const handleTag = (tag) => {
    // whenever user clicks on an existing tag, exlucde that tag
    if (selectedTags.value.includes(tag)) {
        selectedTags.value = selectedTags.value.filter(
            t => t !== tag
        );
        // when user want to add an tag
        // if it's "ALL", make ALL others unselectedTags
        // if it is not "ALL", make sure "ALL" is not also present in the array
    } else if (tag !== "ALL") {
        selectedTags.value.push(tag);
        if (selectedTags.value.includes("ALL")) {
            selectedTags.value = selectedTags.value.filter(
                t => t !== "ALL"
            );
        }
    } else {
        selectedTags.value = ["ALL"];
    }
}

const useTagFilter = () => {
    return { selectedTags, handleTag }
}

export default useTagFilter