import { Usuario } from './Usuario'

export class Administrador extends Usuario {
  private codigoSeguranca = 'abc'

  constructor(nome: string, email: string) {
    super(nome, email)
  }

  getCodigoSeguranca(): string {
    return this.codigoSeguranca
  }

  alterarCodigoSeguranca(novoCodigo: string): void {
    const codigoNormalizado = novoCodigo.trim()

    if (!codigoNormalizado) {
      throw new Error('O código de segurança não pode ficar vazio.')
    }

    this.codigoSeguranca = codigoNormalizado
  }
}