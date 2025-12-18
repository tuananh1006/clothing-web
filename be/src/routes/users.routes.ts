import { Router } from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middleware'
import { loginController, registerController } from '~/controllers/users.controller'
import { wrapRequestHandler } from '~/utils/handler'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.send('User route')
})

usersRouter.post('/login', loginValidator, loginController)
/**
 * Description: The login route for user authentication.
 * Path: /login
 * Method: POST
 * Request Body: { username: string, password: string }
 */

usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
/**
Description: The register route for user registration.
Path: /register
Method: POST
Request Body: { username: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
*/
export default usersRouter
