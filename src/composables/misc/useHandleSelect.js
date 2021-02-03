import { ref } from "vue"

const selected = ref([]);
const handleSelect = (item) => {
    // whenever user clicks on an existing item, exlucde that item
    if (selected.value.includes(item)) {
        selected.value = selected.value.filter(
            s => s !== item
        );
        // when user want to add an item
        // if it's "all", make all others unselected
        // if it is not "all", make sure "all" is not also present in the array
    } else if (item !== "all") {
        selected.value.push(item);
        if (selected.value.includes("all")) {
            selected.value = selected.value.filter(
                s => s !== "all"
            );
        }
    } else {
        selected.value = ["all"];
    }
}

const useHandleSelect = () => {
    return { selected, handleSelect }
}

export default useHandleSelect