const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes')
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', routes)
app.use((err, req, res, next) => {

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error(err);
        return res.send({
            "message": "Invalid JSON payload passed.",
            "status": "error",
            "data": null
          })
    }

    next();
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log('server is listening on port ' + port))
