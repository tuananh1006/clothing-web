import { Router } from 'express'
import {
  loginValidator,
  registerValidator,
  accessTokenValidator,
  refreshTokenValidator,
  socialLoginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  changePasswordValidator
} from '~/middlewares/users.middleware'
import {
  loginController,
  registerController,
  logoutController,
  refreshTokenController,
  socialLoginController,
  forgotPasswordController,
  resetPasswordController,
  verifyForgotPasswordTokenController,
  getMeController,
  updateMeController,
  uploadAvatarController,
  changePasswordController
} from '~/controllers/users.controller'
import { wrapRequestHandler } from '~/utils/handler'
import { uploadAvatar as uploadAvatarMiddleware } from '~/middlewares/upload.middleware'

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

usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))
/**
Description: Refresh access token using refresh token.
Path: /refresh-token
Method: POST
Request Body: { refresh_token: string }
**/

usersRouter.post('/social-login', socialLoginValidator, wrapRequestHandler(socialLoginController))
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordTokenController)
)

/**
 * Description: Get current user profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description: Update current user profile
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Request Body: { first_name?, last_name?, email?, phonenumber?, address?, date_of_birth? }
 */
usersRouter.patch('/me', accessTokenValidator, wrapRequestHandler(updateMeController))

/**
 * Description: Upload user avatar
 * Path: /me/avatar
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Request: multipart/form-data with field 'avatar' (file) OR { avatar_url: string } in body
 */
usersRouter.post(
  '/me/avatar',
  accessTokenValidator,
  uploadAvatarMiddleware,
  wrapRequestHandler(uploadAvatarController)
)

/**
 * Description: Change current user password
 * Path: /me/password
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Request Body: { current_password: string, new_password: string, password_confirmation: string }
 */
usersRouter.patch(
  '/me/password',
  accessTokenValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter
