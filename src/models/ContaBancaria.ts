export class ContaBancaria {
  saldo = 0

  depositar(valor: number): void {
    this.validarValor(valor)
    this.saldo = (Math.round(this.saldo * 100) + Math.round(valor * 100)) / 100
  }

  sacar(valor: number): void {
    this.validarValor(valor)

    if (valor > this.saldo) {
      throw new Error('Saldo insuficiente para realizar o saque.')
    }

    this.saldo = (Math.round(this.saldo * 100) - Math.round(valor * 100)) / 100
  }

  verSaldo(): number {
    return this.saldo
  }

  private validarValor(valor: number): void {
    if (!Number.isFinite(valor) || valor <= 0) {
      throw new Error('Informe um valor maior que zero.')
    }

    if (Math.abs(valor * 100 - Math.round(valor * 100)) > 1e-8) {
      throw new Error('Informe um valor com até duas casas decimais.')
    }
  }
}