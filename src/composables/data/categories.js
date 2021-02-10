import { ref } from "vue"

const cats = [
    "Programming",
    "Artificial Intelligence",
    "Big Data",
    "Mathematics",
    "Causal Inference",
    "Network Analysis",
    "Statistical Computing",
    "General Data Science",
    "Healthcare Analytics",
    "Regression Analysis",
    "Bayesian Analysis",
    "Recommender Systems",
    "Statistical Learning",
    "Reproducible Analysis",
    "Information Theory",
    "Text Mining",
    "Natural Language Processing",
    "Data Visualization",
    "Data Analysis",
    "Machine Learning",
    "Deep Learning",
    "Data Structures and Algorithms",
    "Software Development",
]
cats.sort()
const categories = ref(cats);
export default categories