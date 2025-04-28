import { env } from './env'
import { app } from './app'

app
  .listen({
    port: env.PORT || 3100,
    host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
  })
  .then(() => console.log('Server is running!'))
  .catch((err) => console.log(err))
