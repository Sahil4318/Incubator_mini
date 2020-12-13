const express = require('express')
require('./db/mongoose')
//const mentorRouter = require('./routers/mentor')
const studentRouter = require('./routers/student')
const jwt = require('jsonwebtoken')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
//app.use(mentorRouter)
app.use(studentRouter)

app.use((req, res, next) => {
    res.status(503).send('Site is currently down. Check back soon!')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})