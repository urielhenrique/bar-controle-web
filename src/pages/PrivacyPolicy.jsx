import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            BarStock
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Politica de Privacidade
          </h1>
          <p className="text-sm text-slate-500">
            Ultima atualizacao: 22 de fevereiro de 2026
          </p>
        </header>

        <section className="mt-10 space-y-6 text-base leading-7 text-slate-700">
          <p>
            A BarStock oferece um sistema SaaS de gerenciamento de estoque para
            bares e estabelecimentos de bebidas. Esta Politica de Privacidade
            explica como coletamos, usamos e protegemos suas informacoes quando
            voce acessa barstock.codenorin.com.br e nossos servicos.
          </p>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Dados que coletamos
            </h2>
            <ul className="list-disc pl-5">
              <li>Nome e email fornecidos no cadastro ou no login Google.</li>
              <li>Dados de uso do sistema para melhoria e seguranca.</li>
              <li>Informacoes de pagamento processadas pela Stripe.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Login com Google
            </h2>
            <p>
              Quando voce escolhe entrar com o Google, recebemos seu nome e
              email para criar ou autenticar sua conta. O processo segue os
              requisitos do Google OAuth e nao solicitamos sua senha do Google.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">Pagamentos</h2>
            <p>
              Pagamentos sao processados pela Stripe. Nao armazenamos dados
              completos de cartao. A Stripe pode coletar informacoes adicionais
              para concluir a transacao de forma segura.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Protecao e seguranca
            </h2>
            <p>
              Utilizamos controles tecnicos e organizacionais para proteger seus
              dados contra acesso nao autorizado, alteracao ou divulgacao.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">Seus direitos</h2>
            <p>
              Voce pode solicitar acesso, correcao ou exclusao de seus dados. Para
              exercer seus direitos, entre em contato pelo email
              uriel.henrique.gomes.uh@gmail.com.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Retencao de dados
            </h2>
            <p>
              Mantemos seus dados apenas pelo tempo necessario para operar o
              servico e cumprir obrigacoes legais.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">
              Atualizacoes
            </h2>
            <p>
              Podemos atualizar esta politica periodicamente. Recomendamos que
              voce revise esta pagina para se manter informado.
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
