import { Router } from 'express'
import {
  loginValidator,
  registerValidator,
  accessTokenValidator,
  refreshTokenValidator
} from '~/middlewares/users.middleware'
import { loginController, registerController, logoutController } from '~/controllers/users.controller'
import { wrapRequestHandler } from '~/utils/handler'

const usersRouter = Router()

usersRouter.get('/', (req, res) => {
  res.send('User route')
})

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))
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

usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))
/**
Description: The logout route for user logout.
Path: /logout
Method: POST
Request Body: { refresh_token: string }
**/

export default usersRouter
