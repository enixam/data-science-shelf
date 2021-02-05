import { ref } from "vue"

const selectedCategories = ref([]);
const handleCategory = (category) => {
    if (selectedCategories.value.includes(category)) {
        selectedCategories.value = selectedCategories.value.filter(
            c => c !== category
        );
    } else if (category !== "ALL") {
        selectedCategories.value.push(category);
        if (selectedCategories.value.includes("ALL")) {
            selectedCategories.value = selectedCategories.value.filter(
                c => c !== "ALL"
            );
        }
    } else {
        selectedCategories.value = ["ALL"];
    }
    console.log("category: ", selectedCategories.value)
}



const useCategoryFilter = () => {
    return { selectedCategories, handleCategory }
}

export default useCategoryFilter