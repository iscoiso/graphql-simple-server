const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const GraphQLServer = require('express-graphql')
const graphqlSchema = require('./graphql/schema')
const resolver = require('./graphql/resolvers')

const app = express()

app.use(bodyParser.json())

app.use(
  '/graphql',
  GraphQLServer({
    schema: graphqlSchema,
    rootValue: resolver
  })
)

app.use((error, req, res, next) => {
  console.log(error)

  const status = error.statusCode || 500
  const message = error.message
  const data = error.data

  res.status(status).json({ message: message, data: data })
})

// db
mongoose.connect(
  'mongodb://test:test12345@ds263295.mlab.com:63295/graphi_app',
  { useNewUrlParser: true }
)
mongoose.Promise = global.Promise
mongoose.connection.on('error', err => {
  console.error(`Error → ${err.message}`)
})

app.listen(5000, () => {
  console.log('server running on port 5000')
})
