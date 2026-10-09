import { useState, type FormEvent } from 'react'
import { Administrador } from './models/Administrador'
import { ContaBancaria } from './models/ContaBancaria'
import { Email } from './models/Email'
import './App.css'

function App() {
  const [usuario] = useState(() => new Administrador('Otávio', 'otavio@example.com'))
  const [tela, setTela] = useState<'login' | 'recuperacao' | 'banco'>('login')
  const [senhaTentativa, setSenhaTentativa] = useState('')
  const [nomeRecuperacao, setNomeRecuperacao] = useState('')
  const [emailRecuperacao, setEmailRecuperacao] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagemAcesso, setMensagemAcesso] = useState('')
  const [tipoMensagemAcesso, setTipoMensagemAcesso] = useState<'sucesso' | 'erro' | ''>('')
  const [area, setArea] = useState<'conta' | 'email' | 'administrador'>('conta')
  const [codigoSeguranca, setCodigoSeguranca] = useState(() => usuario.getCodigoSeguranca())
  const [novoCodigoSeguranca, setNovoCodigoSeguranca] = useState('')
  const [mensagemAdministrador, setMensagemAdministrador] = useState('')
  const [tipoMensagemAdministrador, setTipoMensagemAdministrador] = useState<'sucesso' | 'erro' | ''>('')
  const [destinatario, setDestinatario] = useState('')
  const [assuntoEmail, setAssuntoEmail] = useState('')
  const [corpoEmail, setCorpoEmail] = useState('')
  const [mensagemEmail, setMensagemEmail] = useState('')
  const [tipoMensagemEmail, setTipoMensagemEmail] = useState<'sucesso' | 'erro' | ''>('')
  const [conta] = useState(() => new ContaBancaria())
  const [saldo, setSaldo] = useState(conta.verSaldo())
  const [operacao, setOperacao] = useState<'deposito' | 'saque'>('deposito')
  const [valor, setValor] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('')

  function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!usuario.autenticar(senhaTentativa)) {
      setMensagemAcesso('Senha incorreta. Tente novamente.')
      setTipoMensagemAcesso('erro')
      return
    }

    setTela('banco')
    setMensagemAcesso('')
    setTipoMensagemAcesso('')
    setSenhaTentativa('')
  }

  function abrirRecuperacao() {
    setTela('recuperacao')
    setMensagemAcesso('')
    setTipoMensagemAcesso('')
  }

  function redefinirSenha(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nomeConfere = nomeRecuperacao.trim().toLocaleLowerCase('pt-BR')
      === usuario.getNome().toLocaleLowerCase('pt-BR')
    const emailConfere = emailRecuperacao.trim().toLocaleLowerCase('pt-BR')
      === usuario.getEmail().toLocaleLowerCase('pt-BR')

    if (!nomeConfere || !emailConfere) {
      setMensagemAcesso('Nome ou e-mail não conferem com o cadastro.')
      setTipoMensagemAcesso('erro')
      return
    }

    if (novaSenha.trim() !== confirmarSenha.trim()) {
      setMensagemAcesso('A confirmação não corresponde à nova senha.')
      setTipoMensagemAcesso('erro')
      return
    }

    try {
      usuario.redefinirSenha(novaSenha)
      setTela('login')
      setSenhaTentativa('')
      setNomeRecuperacao('')
      setEmailRecuperacao('')
      setNovaSenha('')
      setConfirmarSenha('')
      setMensagemAcesso('Senha redefinida. Entre com sua nova senha.')
      setTipoMensagemAcesso('sucesso')
    } catch (erro) {
      setMensagemAcesso(erro instanceof Error ? erro.message : 'Não foi possível redefinir a senha.')
      setTipoMensagemAcesso('erro')
    }
  }

  function sair() {
    setTela('login')
    setArea('conta')
    setSenhaTentativa('')
    setMensagemAcesso('')
    setTipoMensagemAcesso('')
  }

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

  function enviarEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const email = new Email(destinatario, assuntoEmail, corpoEmail)
      setMensagemEmail(email.enviar())
      setTipoMensagemEmail('sucesso')
    } catch (erro) {
      setMensagemEmail(erro instanceof Error ? erro.message : 'Não foi possível enviar o e-mail.')
      setTipoMensagemEmail('erro')
    }
  }

  function alterarCodigoSeguranca(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      usuario.alterarCodigoSeguranca(novoCodigoSeguranca)
      setCodigoSeguranca(usuario.getCodigoSeguranca())
      setNovoCodigoSeguranca('')
      setMensagemAdministrador('Código de segurança atualizado.')
      setTipoMensagemAdministrador('sucesso')
    } catch (erro) {
      setMensagemAdministrador(erro instanceof Error ? erro.message : 'Não foi possível alterar o código.')
      setTipoMensagemAdministrador('erro')
    }
  }

  return (
    <main className="banking-app">
      <header className="topbar">
        <a className="brand" href={tela === 'banco' ? '#inicio' : '#acesso'} aria-label="Conta GG">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>conta<span className="brand-light">GG</span></span>
        </a>
        {tela === 'banco' ? (
          <button className="account-tag logout-button" type="button" onClick={sair}>
            {usuario.getNome()} <span aria-hidden="true">↗</span>
          </button>
        ) : (
          <span className="account-tag"><span className="status-dot" /> Acesso ao sistema</span>
        )}
      </header>

      {tela === 'banco' ? (
      <>
      <nav className="workspace-nav" aria-label="Áreas do sistema">
        <button
          type="button"
          className={area === 'conta' ? 'workspace-tab active' : 'workspace-tab'}
          aria-current={area === 'conta' ? 'page' : undefined}
          onClick={() => setArea('conta')}
        >
          Minha conta
        </button>
        <button
          type="button"
          className={area === 'email' ? 'workspace-tab active' : 'workspace-tab'}
          aria-current={area === 'email' ? 'page' : undefined}
          onClick={() => { setArea('email'); setMensagemEmail(''); setTipoMensagemEmail('') }}
        >
          Enviar e-mail
        </button>
        <button
          type="button"
          className={area === 'administrador' ? 'workspace-tab active' : 'workspace-tab'}
          aria-current={area === 'administrador' ? 'page' : undefined}
          onClick={() => { setArea('administrador'); setMensagemAdministrador(''); setTipoMensagemAdministrador('') }}
        >
          Administrador
        </button>
      </nav>
      {area === 'conta' ? (
      <div className="dashboard" id="inicio">
        <section className="overview" aria-labelledby="welcome-title">
          <p className="eyebrow">ÁREA DO CLIENTE <span> / </span> VISÃO GERAL</p>
          <h1 id="welcome-title">Seu dinheiro,<br />sob seu controle.</h1>
          <p className="intro">{usuario.apresentar()} Acompanhe seu saldo e faça movimentações na sua conta.</p>

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
      ) : area === 'email' ? (
        <div className="email-layout">
          <section className="email-intro" aria-labelledby="email-title">
            <p className="eyebrow">MENSAGENS <span> / </span> NOVO E-MAIL</p>
            <h1 id="email-title">Uma mensagem<br />do seu jeito.</h1>
            <p className="intro">Escreva sua mensagem e informe quem deve recebê-la.</p>
            <div className="email-note">
              <span aria-hidden="true">✉</span>
              <p>Este envio funciona em modo de demonstração. Para entregar e-mails de verdade, é necessário conectar um serviço de envio.</p>
            </div>
          </section>

          <section className="email-panel" aria-labelledby="email-form-title">
            <div className="transaction-heading">
              <p className="eyebrow">NOVA MENSAGEM</p>
              <h2 id="email-form-title">Compor e-mail</h2>
            </div>
            <form className="auth-form email-form" onSubmit={enviarEmail}>
              <label htmlFor="destinatario">E-mail do destinatário</label>
              <input
                id="destinatario"
                name="destinatario"
                type="email"
                autoComplete="email"
                placeholder="nome@exemplo.com"
                value={destinatario}
                onChange={(event) => setDestinatario(event.target.value)}
                required
              />
              <label htmlFor="assunto-email">Assunto</label>
              <input
                id="assunto-email"
                name="assunto"
                type="text"
                placeholder="Sobre o que é a mensagem?"
                value={assuntoEmail}
                onChange={(event) => setAssuntoEmail(event.target.value)}
                required
              />
              <label htmlFor="corpo-email">Corpo do e-mail</label>
              <textarea
                id="corpo-email"
                name="corpo"
                rows={5}
                placeholder="Escreva sua mensagem..."
                value={corpoEmail}
                onChange={(event) => setCorpoEmail(event.target.value)}
                required
              />
              <button className="submit-button" type="submit">
                Enviar e-mail <span aria-hidden="true">→</span>
              </button>
            </form>
            {mensagemEmail && (
              <p className={`feedback ${tipoMensagemEmail}`} role="status">
                <span aria-hidden="true">{tipoMensagemEmail === 'sucesso' ? '✓' : '!'}</span>
                {mensagemEmail}
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="email-layout">
          <section className="email-intro" aria-labelledby="admin-title">
            <p className="eyebrow">ADMINISTRAÇÃO <span> / </span> SEGURANÇA</p>
            <h1 id="admin-title">Acesso sob<br />seu controle.</h1>
            <p className="intro">Consulte e atualize o código de segurança do administrador.</p>
            <div className="email-note">
              <span aria-hidden="true">◇</span>
              <p>O código é usado apenas nesta demonstração e fica disponível enquanto a página permanecer aberta.</p>
            </div>
          </section>

          <section className="email-panel admin-panel" aria-labelledby="admin-form-title">
            <div className="transaction-heading">
              <p className="eyebrow">CÓDIGO DE SEGURANÇA</p>
              <h2 id="admin-form-title">Configurações do administrador</h2>
            </div>
            <div className="security-code-display">
              <span>Código atual</span>
              <strong aria-live="polite">{codigoSeguranca}</strong>
            </div>
            <form className="auth-form" onSubmit={alterarCodigoSeguranca}>
              <label htmlFor="novo-codigo-seguranca">Novo código de segurança</label>
              <input
                id="novo-codigo-seguranca"
                name="novoCodigoSeguranca"
                type="password"
                autoComplete="new-password"
                value={novoCodigoSeguranca}
                onChange={(event) => setNovoCodigoSeguranca(event.target.value)}
                required
              />
              <button className="submit-button" type="submit">
                Atualizar código <span aria-hidden="true">→</span>
              </button>
            </form>
            {mensagemAdministrador && (
              <p className={`feedback ${tipoMensagemAdministrador}`} role="status">
                <span aria-hidden="true">{tipoMensagemAdministrador === 'sucesso' ? '✓' : '!'}</span>
                {mensagemAdministrador}
              </p>
            )}
          </section>
        </div>
      )}
      </>
      ) : (
        <div className="auth-layout" id="acesso">
          <section className="auth-intro" aria-labelledby="auth-title">
            <p className="eyebrow">CONTA GG <span> / </span> ACESSO SEGURO</p>
            <h1 id="auth-title">
              {tela === 'login' ? <>Sua conta,<br />com você.</> : <>Vamos recuperar<br />seu acesso.</>}
            </h1>
            <p className="intro">
              {tela === 'login'
                ? 'Entre para acompanhar seu saldo e movimentar sua conta.'
                : 'Confirme seus dados e cadastre uma nova senha.'}
            </p>
            <div className="demo-profile">
              <span className="demo-label">PERFIL DE DEMONSTRAÇÃO</span>
              <strong>{usuario.getNome()} <span>·</span> {usuario.getEmail()}</strong>
              {tela === 'login' && <p>Senha inicial: <b>123</b></p>}
            </div>
          </section>

          <section className="auth-panel" aria-label={tela === 'login' ? 'Entrar na conta' : 'Redefinir senha'}>
            {tela === 'login' ? (
              <>
                <div className="transaction-heading">
                  <p className="eyebrow">BEM-VINDO DE VOLTA</p>
                  <h2>Entrar na sua conta</h2>
                </div>
                <form className="auth-form" onSubmit={entrar}>
                  <label htmlFor="senha-tentativa">Digite sua senha</label>
                  <input
                    id="senha-tentativa"
                    name="senha"
                    type="password"
                    autoComplete="current-password"
                    value={senhaTentativa}
                    onChange={(event) => setSenhaTentativa(event.target.value)}
                    required
                  />
                  <button className="submit-button" type="submit">
                    Acessar conta <span aria-hidden="true">→</span>
                  </button>
                </form>
                <button className="auth-link" type="button" onClick={abrirRecuperacao}>
                  Esqueci minha senha
                </button>
              </>
            ) : (
              <>
                <div className="transaction-heading">
                  <p className="eyebrow">RECUPERAÇÃO DE ACESSO</p>
                  <h2>Redefinir senha</h2>
                </div>
                <form className="auth-form recovery-form" onSubmit={redefinirSenha}>
                  <label htmlFor="nome-recuperacao">Nome cadastrado</label>
                  <input
                    id="nome-recuperacao"
                    name="nome"
                    type="text"
                    autoComplete="name"
                    value={nomeRecuperacao}
                    onChange={(event) => setNomeRecuperacao(event.target.value)}
                    required
                  />
                  <label htmlFor="email-recuperacao">E-mail cadastrado</label>
                  <input
                    id="email-recuperacao"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={emailRecuperacao}
                    onChange={(event) => setEmailRecuperacao(event.target.value)}
                    required
                  />
                  <label htmlFor="nova-senha">Nova senha</label>
                  <input
                    id="nova-senha"
                    name="novaSenha"
                    type="password"
                    autoComplete="new-password"
                    minLength={4}
                    value={novaSenha}
                    onChange={(event) => setNovaSenha(event.target.value)}
                    required
                  />
                  <label htmlFor="confirmar-senha">Confirme a nova senha</label>
                  <input
                    id="confirmar-senha"
                    name="confirmarSenha"
                    type="password"
                    autoComplete="new-password"
                    minLength={4}
                    value={confirmarSenha}
                    onChange={(event) => setConfirmarSenha(event.target.value)}
                    required
                  />
                  <button className="submit-button" type="submit">
                    Salvar nova senha <span aria-hidden="true">→</span>
                  </button>
                </form>
                <button className="auth-link" type="button" onClick={() => setTela('login')}>
                  Voltar para o acesso
                </button>
              </>
            )}

            {mensagemAcesso && (
              <p className={`feedback ${tipoMensagemAcesso}`} role="status">
                <span aria-hidden="true">{tipoMensagemAcesso === 'sucesso' ? '✓' : '!'}</span>
                {mensagemAcesso}
              </p>
            )}
          </section>
        </div>
      )}
      <footer className="page-footer">
        <span>CONTA GG <span className="footer-separator">/</span> SERVIÇOS FINANCEIROS</span>
        <span>Simples assim.</span>
      </footer>
    </main>
  )
}

export default App
