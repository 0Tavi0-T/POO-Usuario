export class Usuario {
  nome: string
  idade: number
  senha: string

  constructor(nome: string, idade: number, senha: string) {
    this.nome = nome
    this.idade = idade
    this.senha = senha
  }

  apresentar(): string {
    return `Olá, ${this.nome}! Você tem ${this.idade} anos.`
  }

  verificarSenha(tentativa: string): boolean {
    return tentativa === this.senha
  }

  redefinirSenha(novaSenha: string): void {
    const senhaNormalizada = novaSenha.trim()

    if (senhaNormalizada.length < 4) {
      throw new Error('A nova senha deve ter pelo menos 4 caracteres.')
    }

    this.senha = senhaNormalizada
  }
}