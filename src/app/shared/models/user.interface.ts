export interface RequestUsuario {
    id: number
    name: string
    firstLastname: string
    secondLastname: string
    user: string
    password: string
    typeDocument: string
    numberDocument: string
    country: string
    ubigeo: string
    address: string
    birthDate: string
    phone: string
    email: string
    roleIds: string[]
  }