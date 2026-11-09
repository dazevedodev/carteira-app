import Link from "next/link";
import "./landing.css";
import { DashboardPreview, RentCalculator } from "./LandingInteractive";
import {
  LogoIcon,
  BuildingIcon,
  UsersIcon,
  WalletIcon,
  WrenchIcon,
} from "@/components/icons";

function LogoLockup() {
  return (
    <span className="logo-lockup">
      <span className="logo-mark">
        <LogoIcon className="h-5 w-5" />
      </span>
      <span className="logo-text">
        Carteira
        <br />
        <b>de Aluguel</b>
      </span>
    </span>
  );
}

export default function Home() {
  return (
    <div className="landing">
      <nav className="nav">
        <div className="wrap">
          <LogoLockup />
          <Link className="cta" href="/signup">
            Criar conta
          </Link>
        </div>
      </nav>

      <header className="hero">
        <div className="wrap">
          <div>
            <span className="badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2.5" y="4" width="19" height="13" rx="1.5" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              Sistema web
            </span>
            <span className="eyebrow">Para administradoras e corretores de aluguel</span>
            <h1>
              Cada cliente, sua carteira de imóveis — <em>organizada de verdade</em>.
            </h1>
            <p className="lede">
              Você administra o aluguel de várias pessoas — um cliente com 10 casas,
              outro com 2. Contratos com documentos anexados, pagamentos com multa e
              juros calculados sozinhos, comissão e repasse automáticos por cliente,
              reformas controladas.
            </p>
            <div className="actions">
              <Link className="btn primary" href="/signup">
                Criar conta grátis
              </Link>
              <a className="btn ghost" href="#recursos">
                Ver como funciona
              </a>
            </div>
            <ul className="quick-features">
              <li>
                <span className="qf-icon">
                  <BuildingIcon className="h-4 w-4" />
                </span>
                <span className="label">Imóveis e contratos</span>
              </li>
              <li>
                <span className="qf-icon">
                  <UsersIcon className="h-4 w-4" />
                </span>
                <span className="label">Inquilinos e clientes</span>
              </li>
              <li>
                <span className="qf-icon">
                  <WalletIcon className="h-4 w-4" />
                </span>
                <span className="label">Repasses e pagamentos</span>
              </li>
              <li>
                <span className="qf-icon">
                  <WrenchIcon className="h-4 w-4" />
                </span>
                <span className="label">Reformas e manutenções</span>
              </li>
            </ul>
          </div>
          <div className="device">
            <DashboardPreview />
          </div>
        </div>
      </header>

      <div className="divider" />

      <main>
        <section className="pad" id="recursos">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">O que já resolve</span>
              <h2>Pra quem administra a carteira de imóveis de vários clientes</h2>
              <p>
                Cada recurso nasceu de um problema real de quem cuida do aluguel de
                outras pessoas — um cliente com 10 casas, outro com 2 — com comissão
                e prestação de contas de verdade.
              </p>
            </div>
            <div className="features">
              <div className="feature">
                <div className="stub">
                  <div className="icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                  </div>
                </div>
                <div className="fbody">
                  <h3>Multa, juros e correção sozinhos</h3>
                  <p>Cada contrato tem suas próprias taxas. O sistema calcula o valor devido pró-rata pelos dias de atraso.</p>
                </div>
              </div>
              <div className="feature">
                <div className="stub">
                  <div className="icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
                    </svg>
                  </div>
                </div>
                <div className="fbody">
                  <h3>Uma carteira por cliente</h3>
                  <p>Um cliente com 10 casas, outro com 2 — o sistema separa sozinho o previsto e o recebido de cada carteira.</p>
                </div>
              </div>
              <div className="feature">
                <div className="stub">
                  <div className="icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM19 8v6M22 11h-6" />
                    </svg>
                  </div>
                </div>
                <div className="fbody">
                  <h3>Comissão e repasse automáticos</h3>
                  <p>O sistema calcula sua comissão sobre o que entrou e o líquido a repassar pra cada cliente.</p>
                </div>
              </div>
              <div className="feature">
                <div className="stub">
                  <div className="icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                  </div>
                </div>
                <div className="fbody">
                  <h3>Reforma sem perder o fio</h3>
                  <p>Pedreiro, caçamba, material — cada reforma com fornecedores, custos e status, ligados à casa certa.</p>
                </div>
              </div>
              <div className="feature">
                <div className="stub">
                  <div className="icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6ZM14 2v6h6M9 15h6M9 11h2" />
                    </svg>
                  </div>
                </div>
                <div className="fbody">
                  <h3>Contrato, RG e documentos anexados</h3>
                  <p>Guarda a foto do contrato assinado e de outros documentos junto do próprio contrato.</p>
                </div>
              </div>
              <div className="feature">
                <div className="stub">
                  <div className="icon">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>
                <div className="fbody">
                  <h3>Comprovante junto do pagamento</h3>
                  <p>Anexa a foto do Pix ou depósito na hora de registrar — guardado junto com o pagamento.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section className="pad" id="calculadora">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">Experimente</span>
              <h2>Mexa nos números e veja a conta na hora</h2>
              <p>É exatamente esse cálculo que o sistema faz sozinho pra cada inquilino atrasado, todo mês.</p>
            </div>
            <RentCalculator />
          </div>
        </section>

        <div className="divider" />

        <section className="pad">
          <div className="wrap">
            <div className="split">
              <div>
                <span className="eyebrow" style={{ color: "var(--stamp)" }}>Uma carteira por cliente</span>
                <h2>10 casas de um cliente, 2 de outro — cada centavo no lugar certo</h2>
                <p>Cadastre de quem é cada imóvel e o painel separa sozinho o previsto, o recebido e, quando você administra pra alguém, a sua comissão e o líquido a repassar.</p>
                <ul>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6 9 17l-5-5" /></svg>
                    Imóveis agrupados por cliente
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6 9 17l-5-5" /></svg>
                    Comissão calculada só nos imóveis que você administra
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6 9 17l-5-5" /></svg>
                    Filtro de pagamentos por cliente
                  </li>
                </ul>
              </div>
              <div className="visual">
                <div className="owner-demo">
                  <div className="owner-row"><span className="name">Marcos Reis <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>— 10 imóveis</span></span><span className="amt">R$ 8.460</span></div>
                  <div className="owner-row"><span className="name">Imobiliária Vitale <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>— 2 imóveis</span></span><span className="amt">R$ 2.600</span></div>
                  <div className="owner-row"><span className="name">Você (imóvel próprio) <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>— 1 imóvel</span></span><span className="amt">R$ 1.600</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pad" style={{ background: "var(--surface)" }}>
          <div className="wrap">
            <div className="split reverse">
              <div>
                <span className="eyebrow" style={{ color: "var(--stamp)" }}>Manutenção com dono e prazo</span>
                <h2>Reforma organizada, do pedreiro à caçamba</h2>
                <p>Um imóvel de qualquer cliente em obra mostra na hora — com todos os fornecedores envolvidos, o custo de cada um e o status.</p>
                <ul>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6 9 17l-5-5" /></svg>
                    Itens de obra com responsável e contato
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6 9 17l-5-5" /></svg>
                    Custo total somado automaticamente
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6 9 17l-5-5" /></svg>
                    Casa marcada como &quot;em reforma&quot; pra todo mundo ver
                  </li>
                </ul>
              </div>
              <div className="visual">
                <div className="reform-card">
                  <div className="top">
                    <div>
                      <h4>Casa 2 — Reforma do telhado</h4>
                      <span className="muted">Aberta em 12/08 · previsão 30/09</span>
                    </div>
                    <span className="pill warn">Em andamento</span>
                  </div>
                  <div className="item-line"><span className="who">Pedreiro — Zé da Obra</span><span className="cost">R$ 800</span></div>
                  <div className="item-line"><span className="who">Caçamba — Entulho Rápido</span><span className="cost">R$ 220</span></div>
                  <div className="item-line"><span className="who">Material — Telhas e ripas</span><span className="cost">R$ 1.140</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        <section className="pad" id="contato">
          <div className="wrap">
            <div className="cta-band">
              <span className="badge">Pronto pra usar</span>
              <h2>Administra aluguel de clientes? Comece a organizar sua carteira agora.</h2>
              <p>Grátis pra começar — administradoras, corretores e quem cuida do aluguel da própria família.</p>
              <div className="actions">
                <Link className="btn primary" href="/signup">Criar conta grátis</Link>
                <Link className="btn ghost" href="/login">Já tem conta? Entrar</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <LogoLockup />
          <nav className="links" aria-label="Links do rodapé">
            <Link href="/termos">Termos de uso</Link>
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/ajuda">Ajuda</Link>
          </nav>
          <span className="fine">
            © 2026 ZantteBR · carteiradealuguel.com.br
          </span>
        </div>
      </footer>
    </div>
  );
}
