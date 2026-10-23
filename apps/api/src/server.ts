import express from 'express'

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '100kb' }))

app.get('/api/v1/health', (_request, response) => {
  response.json({ service: 'brooklyn-warehouse-api', status: 'ok', phase: 'frontend-development' })
})

app.use((_request, response) => {
  response
    .status(404)
    .json({ error: { code: 'NOT_FOUND', message: 'This endpoint is not available.' } })
})

const port = Number(process.env.PORT ?? 3000)
const host = process.env.HOST ?? '127.0.0.1'
const server = app.listen(port, host, () => {
  console.log(`Brooklyn API listening at http://${host}:${port}`)
})

for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => server.close(() => process.exit(0)))
}
