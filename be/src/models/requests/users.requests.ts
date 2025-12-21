export interface RegisterRequestBody {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  agree_terms: boolean
}

export interface LoginRequestBody {
  email: string
  password: string
  remember_me?: boolean
}
