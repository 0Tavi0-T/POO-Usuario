export class Usuario {
  private nome: string
  private email: string
  private senha = '123'

  constructor(nome: string, email: string) {
    this.nome = nome
    this.email = email
  }

  apresentar(): string {
    return `Olá, ${this.nome}!`
  }

  autenticar(senha: string): boolean {
    return senha === this.senha
  }

  getNome(): string {
    return this.nome
  }

  getEmail(): string {
    return this.email
  }

  redefinirSenha(novaSenha: string): void {
    const senhaNormalizada = novaSenha.trim()

    if (senhaNormalizada.length < 4) {
      throw new Error('A nova senha deve ter pelo menos 4 caracteres.')
    }

    this.senha = senhaNormalizada
  }
}