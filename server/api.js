const mongoose = require("mongoose")
const mongoStructs = require("./structs")
const {v4: uuidv4} = require("uuid")
module.exports = (dbURL) => {
    var db = []
    mongoose.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true})
    for (var name of Object.keys(mongoStructs)) {
        db[name] = mongoose.model(name, mongoStructs[name]);
    }
    return {
        submit: async data => {
            let time = (new Date()).getTime();
            console.log(data)
            await db.user.updateOne({
                name: data.name
            },
            {
                lastEntry: time,
                lastResult: data.result
            },
            {upsert: false})
            let newEntry = await db.entry.create({
                _id: uuidv4(),
                timestamp: time,
                user: data.name,
                content: data.submission,
                result: data.result
            })
            return newEntry;
        },
        getAllUsers: async data => {
            return await db.user.find({});
        }
    }
}