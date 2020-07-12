const mongoose = require('mongoose')
mongoose.connect(process.env.DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('connected to database succesfully')
}).catch(e => {
    console.log('unable to connect to database')
})