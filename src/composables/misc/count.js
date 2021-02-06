import { ref } from "vue"

const count = (documents, entry, lowercase = false) => {
    const items = ref([])
    const itemSet = new Set()
    const itemCount = ref({ "ALL": "" })

    // get unique values
    documents.forEach(doc => {
        doc[entry].forEach(e => {
            itemSet.add(e)
        })
    })

    // get their occurrence
    items.value = [...itemSet]
    items.value.forEach(i => {
        let s = 0;
        documents.forEach(doc => {
            if (doc[entry].includes(i)) {
                s++
            }
        })
        if (lowercase) {
            itemCount.value[i.toLowerCase()] = s
        }

    })


    return itemCount
}

export default count