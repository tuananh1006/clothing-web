import express from 'express'
import usersRouter from './routes/users.routes'
import categoriesRouter from './routes/categories.routes'
import productsRouter from './routes/products.routes'
import bannersRouter from './routes/banners.routes'
import cartRouter from './routes/cart.routes'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middleware'
import { config } from 'dotenv'

const PORT = 5000
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
databaseServices.connect().catch(console.dir)
config()
//  Use user routes
app.use('/api/v1/auth', usersRouter)
app.use('/api/v1/categories', categoriesRouter)
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/banners', bannersRouter)
app.use('/api/v1/cart', cartRouter)

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// Error handler must be registered last
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
