import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            BarStock
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Termos de Servico
          </h1>
          <p className="text-sm text-slate-500">
            Ultima atualizacao: 22 de fevereiro de 2026
          </p>
        </header>

        <section className="mt-10 space-y-6 text-base leading-7 text-slate-700">
          <p>
            Estes Termos de Servico regem o uso do BarStock, um micro-SaaS de
            gestao de estoque. Ao acessar barstock.codenorin.com.br, voce concorda
            com estes termos.
          </p>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">Conta</h2>
            <p>
              Voce e responsavel por manter suas credenciais seguras. O login com
              Google pode ser utilizado para facilitar o acesso, seguindo as
              politicas do Google OAuth.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">Uso adequado</h2>
            <p>
              Voce concorda em usar o BarStock de forma licita e nao tentar
              comprometer a seguranca, disponibilidade ou integridade do sistema.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">Pagamentos</h2>
            <p>
              Caso haja planos pagos, os pagamentos sao processados pela Stripe.
              A precificacao e cobranca podem ser atualizadas mediante aviso.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Dados e privacidade
            </h2>
            <p>
              O tratamento de dados pessoais segue a nossa Politica de
              Privacidade, incluindo a coleta de nome e email para criacao de
              conta e autenticacao.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Disponibilidade
            </h2>
            <p>
              Buscamos alta disponibilidade, mas nao garantimos operacao
              ininterrupta. Podemos realizar manutencoes programadas.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">Encerramento</h2>
            <p>
              Podemos suspender ou encerrar contas em caso de violacao destes
              termos ou uso indevido do servico.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">Contato</h2>
            <p>
              Para duvidas ou solicitacoes, entre em contato pelo email
              uriel.henrique.gomes.uh@gmail.com.
            </p>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>BarStock - Micro-SaaS de controle de estoque.</p>
            <div className="flex flex-wrap gap-4">
              <Link className="hover:text-slate-700" to="/terms-of-service">
                Termos de Servico
              </Link>
              <Link className="hover:text-slate-700" to="/privacy-policy">
                Politica de Privacidade
              </Link>
              <a
                className="hover:text-slate-700"
                href="mailto:uriel.henrique.gomes.uh@gmail.com"
              >
                Contato
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
