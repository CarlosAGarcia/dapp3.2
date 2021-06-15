// Actions send out the value + their type
export const increment = () => {
    return { type: 'decrement' }
}

export const setLoading = (isLoading) => {
    return { type: SET_LOADING, value: isLoading }
}

// CONSTANTS
export const SET_LOADING = 'setLoading'