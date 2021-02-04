import { ref } from "vue"

const selectedCategories = ref([]);
const handleCategory = (category) => {
    if (selectedCategories.value.includes(category)) {
        selectedCategories.value = selectedCategories.value.filter(
            c => c !== category
        );
    } else if (category !== "all") {
        selectedCategories.value.push(category);
        if (selectedCategories.value.includes("all")) {
            selectedCategories.value = selectedCategories.value.filter(
                c => c !== "all"
            );
        }
    } else {
        selectedCategories.value = ["all"];
    }
    console.log("category: ", selectedCategories.value)
}



const useCategoryFilter = (type) => {
    return { selectedCategories, handleCategory }
}

export default useCategoryFilter