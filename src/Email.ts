export class Email {
  destinatario: string
  assunto: string
  corpo: string

  constructor(destinatario: string, assunto: string, corpo: string) {
    this.destinatario = destinatario
    this.assunto = assunto
    this.corpo = corpo
  }

  enviar(): string {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.destinatario.trim())

    if (!emailValido) {
      throw new Error('Informe um endereço de e-mail válido.')
    }

    if (!this.assunto.trim()) {
      throw new Error('Informe o assunto do e-mail.')
    }

    if (!this.corpo.trim()) {
      throw new Error('Escreva o corpo do e-mail.')
    }

    return `E-mail enviado em modo de demonstração para ${this.destinatario.trim()}.`
  }
}