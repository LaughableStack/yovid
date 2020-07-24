module.exports = {
    user: {
        _id: String,
        name: String,
        lastEntry: Number,
        lastResult: Boolean,
        staff: Boolean
    },
    entry: {
        _id: String,
        timestamp: Number,
        user: String,
        content: Object,
        result: Boolean
    }
}