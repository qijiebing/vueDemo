const comMutations = {
    setData(state, param) {
        for (let key in param) {
            // console.log('key:', key)
            if (/\w+\[\d+\]|\w+\.\w+/g.test(key)) {
                // eslint-disable-next-line no-eval
                eval(`state.${key} = param[key]`)
            } else {
                state[key] = param[key]
            }
        }
    }
}

module.exports = {
    comMutations
}
