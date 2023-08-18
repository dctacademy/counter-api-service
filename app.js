const express = require('express')
const fs = require('fs')
const cors = require('cors')
const app = express()
const port = 3050

app.use(cors())
app.use(express.json())

app.get('/api/counters', (req, res) => {
    fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) {
            res.json(err)
        } else {
            const counters = JSON.parse(data)
            res.json(counters)
        }
    })
})

app.post('/api/counters', (req, res) => {
    const body = req.body
    body._id = Number(new Date())
    body.value = 0 
    fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) {
            res.json(err)
        } else {
            const counters = JSON.parse(data)
            counters.push(body)
            fs.writeFile('./data.json', JSON.stringify(counters), () => {
                res.json(body)
            })
        }
    })
})

app.get('/api/counters/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) {
            res.json(err)
        } else {
            const counters = JSON.parse(data)
            const counter = counters.find(counter => counter._id == id)
            if (counter) {
                res.json(counter)
            } else {
                res.json({})
            }
        }
    })
})

app.put('/api/counters/:id', (req, res) => {
    const id = req.params.id
    const type = req.query.type
    fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) {
            res.json(err)
        } else {
            const counters = JSON.parse(data)
            const counter = counters.find(counter => counter._id == id)
            if (counter) {
                if(type == 'increment') {
                    counter.value++
                } else if( type == 'decrement') {
                    counter.value--
                } else if( type == 'reset') {
                    counter.value = 0 
                } else {
                    res.json({ errors: 'invalid type'})
                }
                // Object.assign(counter, body)
                fs.writeFile('./data.json', JSON.stringify(counters), () => {
                    res.json(counter)
                })
            } else {
                res.json({})
            }
        }
    })
})

app.delete('/api/counters/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data.json', 'utf-8', (err, data) => {
        if (err) {
            res.json(err)
        } else {
            let counters = JSON.parse(data)
            const counter = counters.find(counter => counter._id == id)
            if(counter) {
                counters = counters.filter(counter => counter._id != id)
                fs.writeFile('./data.json', JSON.stringify(counters), () => {
                    res.json(counter)
                })
            } else {
                res.json({})
            }
        }
    })
})


app.listen(port, () => {
    console.log('listening on port', port)
})