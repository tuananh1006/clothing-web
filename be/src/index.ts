import express from 'express'
import usersRouter from './routes/users.routes'
import categoriesRouter from './routes/categories.routes'
import productsRouter from './routes/products.routes'
import bannersRouter from './routes/banners.routes'
import cartRouter from './routes/cart.routes'
import locationsRouter from './routes/locations.routes'
import checkoutRouter from './routes/checkout.routes'
import ordersRouter from './routes/orders.routes'
import adminRouter from './routes/admin.routes'
import contactRouter from './routes/contact.routes'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middleware'
import { config } from 'dotenv'
import path from 'path'
import { buildOpenAPISpec } from './utils/openapi'

const PORT = Number(process.env.PORT) || 5000
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
app.use('/api/v1/locations', locationsRouter)
app.use('/api/v1/checkout', checkoutRouter)
app.use('/api/v1/orders', ordersRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/contact', contactRouter)

// Serve OpenAPI spec (merged from src/docs/openapi/*)
app.get('/openapi.json', (_req, res) => {
  const spec = buildOpenAPISpec()
  res.json(spec)
})
app.get('/api-docs', (_req, res) => {
  res.type('html').send(`<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>YORI API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis],
        layout: 'BaseLayout'
      });
    </script>
  </body>
  </html>`)
})

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// Error handler must be registered last
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
