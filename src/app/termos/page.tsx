import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Termos de uso" };

export default function TermosPage() {
  return (
    <LegalPage title="Termos de uso" atualizado="19 de outubro de 2026">
      <p className="mt-4">
        Estes termos valem para o uso do <strong>Carteira de Aluguel</strong>,
        sistema web da ZantteBR para organizar imóveis, contratos, pagamentos,
        repasses e reformas de aluguel. Ao criar uma conta, você concorda com
        eles.
      </p>

      <h2>1. O que o sistema faz</h2>
      <p>
        O Carteira de Aluguel ajuda você a registrar imóveis, inquilinos,
        contratos e pagamentos, e calcula multa, juros, correção, comissão e
        repasse a partir dos valores que você informa. Os cálculos são uma
        ferramenta de apoio: confira os valores antes de cobrar alguém.
      </p>

      <h2>2. Sua conta</h2>
      <ul>
        <li>Informe dados verdadeiros e mantenha sua senha em segurança.</li>
        <li>
          Você é responsável pelo que acontece na sua conta.
        </li>
        <li>Cada carteira só é visível para quem tem acesso a ela.</li>
      </ul>

      <h2>3. Dados de terceiros</h2>
      <p>
        Ao cadastrar inquilinos, moradores e clientes, você informa dados
        pessoais dessas pessoas. Você declara ter o direito de tratá-los para
        administrar o aluguel e se compromete a usá-los apenas para essa
        finalidade.
      </p>

      <h2>4. Uso permitido</h2>
      <p>
        Não use o sistema para atividades ilegais, para tentar acessar dados de
        outras contas, para sobrecarregar o serviço ou para enviar conteúdo que
        você não tenha direito de armazenar.
      </p>

      <h2>5. Disponibilidade</h2>
      <p>
        Trabalhamos para manter o sistema no ar, mas ele pode ficar
        indisponível por manutenção ou por falhas de terceiros. Não garantimos
        funcionamento ininterrupto. Mantenha cópia dos documentos importantes.
      </p>

      <h2>6. Acesso</h2>
      <p>
        O sistema tem acesso restrito, liberado por convite da ZantteBR, e
        não é vendido no momento. Podemos suspender ou encerrar um acesso a
        qualquer momento, avisando você sempre que possível.
      </p>

      <h2>7. Responsabilidade</h2>
      <p>
        O sistema é oferecido no estado em que está. A ZantteBR não responde por
        decisões tomadas com base nos dados ou cálculos do sistema, nem por
        perdas indiretas, dentro do que a lei permite.
      </p>

      <h2>8. Encerramento</h2>
      <p>
        Você pode parar de usar o sistema quando quiser e pedir a exclusão da
        sua conta e dos seus dados escrevendo para contato@zantte.com.br ou pelo WhatsApp (11) 98893-9120.
        Podemos suspender contas que violem estes termos.
      </p>

      <h2>9. Mudanças</h2>
      <p>
        Podemos atualizar estes termos. Quando a mudança for relevante,
        avisaremos no sistema ou por e-mail. Continuar usando depois do aviso
        significa que você concorda com a nova versão.
      </p>

      <h2>10. Contato</h2>
      <p>
        Dúvidas sobre estes termos:{" "}
        <a className="underline" href="mailto:contato@zantte.com.br">
          contato@zantte.com.br
        </a>
        .
      </p>
    </LegalPage>
  );
}
