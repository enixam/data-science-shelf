import { ref } from "vue"

const count = (documents, entry) => {
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
        itemCount.value[i] = s
    })
    return itemCount
}

export default count