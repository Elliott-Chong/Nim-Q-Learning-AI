const sleep = async ms => new Promise(resolve => setTimeout(resolve, ms))
const qs = (elt, all = false) => {
    if (all) {
        return document.querySelectorAll(elt)
    }
    return document.querySelector(elt)
}
const deepcopy = obj => JSON.parse(JSON.stringify(obj))
function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}
function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}
let COMPUTE = false
const TRAIN = 10000

const toggleCompute = () => {
    COMPUTE = !COMPUTE
}

export { sleep, qs, deepcopy, replacer, reviver, toggleCompute, COMPUTE, TRAIN }