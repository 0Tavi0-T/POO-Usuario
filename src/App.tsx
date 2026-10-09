import { useState, type FormEvent } from 'react'
import { ContaBancaria } from './ContaBancaria'
import './App.css'

function App() {
  const [conta] = useState(() => new ContaBancaria())
  const [saldo, setSaldo] = useState(conta.verSaldo())
  const [operacao, setOperacao] = useState<'deposito' | 'saque'>('deposito')
  const [valor, setValor] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('')

  const saldoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(saldo)

  function realizarOperacao(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const valorNormalizado = valor.trim().includes(',')
      ? valor.trim().replace(/\./g, '').replace(',', '.')
      : valor.trim()
    const valorNumerico = Number(valorNormalizado)

    try {
      if (operacao === 'deposito') {
        conta.depositar(valorNumerico)
        setMensagem('Depósito realizado com sucesso.')
      } else {
        conta.sacar(valorNumerico)
        setMensagem('Saque realizado com sucesso.')
      }

      setSaldo(conta.verSaldo())
      setValor('')
      setTipoMensagem('sucesso')
    } catch (erro) {
      setMensagem(erro instanceof Error ? erro.message : 'Não foi possível realizar a operação.')
      setTipoMensagem('erro')
    }
  }

  return (
    <main className="banking-app">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Conta Clara, início">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>conta<span className="brand-light">clara</span></span>
        </a>
        <span className="account-tag"><span className="status-dot" /> Conta pessoal</span>
      </header>

      <div className="dashboard" id="inicio">
        <section className="overview" aria-labelledby="welcome-title">
          <p className="eyebrow">ÁREA DO CLIENTE <span> / </span> VISÃO GERAL</p>
          <h1 id="welcome-title">Seu dinheiro,<br />sob seu controle.</h1>
          <p className="intro">Acompanhe seu saldo e faça movimentações na sua conta.</p>

          <div className="balance-panel">
            <div className="balance-heading">
              <span>Saldo disponível</span>
              <span className="balance-icon" aria-hidden="true">R$</span>
            </div>
            <p className="balance-value" aria-live="polite">{saldoFormatado}</p>
            <div className="balance-footer">
              <span>CONTA CORRENTE</span>
              <span>•••• 0428</span>
            </div>
          </div>

          <div className="account-note">
            <span className="note-icon" aria-hidden="true">✓</span>
            <p><strong>Conta em dia</strong><br />Seu saldo é atualizado a cada operação.</p>
          </div>
        </section>

        <section className="transaction" aria-labelledby="transaction-title">
          <div className="transaction-heading">
            <p className="eyebrow">MOVIMENTAÇÃO</p>
            <h2 id="transaction-title">O que você precisa fazer?</h2>
          </div>

          <div className="operation-switch" role="group" aria-label="Escolha a operação">
            <button
              type="button"
              className={operacao === 'deposito' ? 'operation-option active' : 'operation-option'}
              aria-pressed={operacao === 'deposito'}
              onClick={() => { setOperacao('deposito'); setMensagem(''); setTipoMensagem('') }}
            >
              <span className="operation-symbol deposit-symbol" aria-hidden="true">↓</span>
              Depósito
            </button>
            <button
              type="button"
              className={operacao === 'saque' ? 'operation-option active' : 'operation-option'}
              aria-pressed={operacao === 'saque'}
              onClick={() => { setOperacao('saque'); setMensagem(''); setTipoMensagem('') }}
            >
              <span className="operation-symbol withdraw-symbol" aria-hidden="true">↑</span>
              Saque
            </button>
          </div>

          <form className="transaction-form" onSubmit={realizarOperacao}>
            <label htmlFor="valor">Valor da operação</label>
            <div className="amount-input">
              <span aria-hidden="true">R$</span>
              <input
                id="valor"
                name="valor"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="0,00"
                value={valor}
                onChange={(event) => setValor(event.target.value)}
                aria-describedby="amount-hint"
              />
            </div>
            <p className="field-hint" id="amount-hint">Use vírgula para os centavos. Ex.: 250,00</p>

            <button className="submit-button" type="submit">
              {operacao === 'deposito' ? 'Confirmar depósito' : 'Confirmar saque'}
              <span aria-hidden="true">→</span>
            </button>

            {mensagem && (
              <p className={`feedback ${tipoMensagem}`} role="status">
                <span aria-hidden="true">{tipoMensagem === 'sucesso' ? '✓' : '!'}</span>
                {mensagem}
              </p>
            )}
          </form>
          <p className="security-note"><span aria-hidden="true">◇</span> Operação segura e imediata</p>
        </section>
      </div>
      <footer className="page-footer">
        <span>CONTA CLARA <span className="footer-separator">/</span> SERVIÇOS FINANCEIROS</span>
        <span>Simples assim.</span>
      </footer>
    </main>
  )
}

export default App
