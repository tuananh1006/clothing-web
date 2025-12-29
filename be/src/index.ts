import express from 'express'
import cors from 'cors'
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
import reviewsRouter from './routes/reviews.routes'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middleware'
import { initializeIndexes } from './utils/db-indexes'
import { config } from 'dotenv'
import path from 'path'
import { buildOpenAPISpec } from './utils/openapi'

const PORT = Number(process.env.PORT) || 5000
const app = express()

// CORS configuration
const allowedOrigins: string[] = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  process.env.FRONTEND_URL || '',
  // Vercel URLs
  'https://clothing-web-alpha.vercel.app',
]

// Add Vercel URL from env if exists
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`)
}

// Function to check if origin is allowed
const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true // Allow requests with no origin
  
  // Check exact matches
  if (allowedOrigins.includes(origin)) return true
  
  // Check Vercel preview deployments (*.vercel.app)
  if (origin.endsWith('.vercel.app')) return true
  
  // For development, allow all origins
  if (process.env.NODE_ENV !== 'production') return true
  
  return false
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// Increase body size limit to handle image uploads (50MB)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Connect to database and initialize indexes
databaseServices
  .connect()
  .then(() => {
    // Initialize database indexes for performance
    initializeIndexes().catch(console.error)
  })
  .catch(console.error)

config()
//  Use user routes - Mount at /api/v1/users to match frontend expectations
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/categories', categoriesRouter)
app.use('/api/v1/products', productsRouter)
app.use('/api/v1/banners', bannersRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/locations', locationsRouter)
app.use('/api/v1/checkout', checkoutRouter)
app.use('/api/v1/orders', ordersRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/contact', contactRouter)
app.use('/api/v1/reviews', reviewsRouter)

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
