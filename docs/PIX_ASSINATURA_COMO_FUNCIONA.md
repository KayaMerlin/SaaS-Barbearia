# PIX de Assinatura: como funciona e como testar

## 1. Como seria na vida real (API de pagamento)

No mundo real, o dinheiro da assinatura **não cai direto no seu banco** pelo nosso código. O fluxo é:

1. **Você se cadastra em um gateway de pagamento** (Mercado Pago, Asaas, Stripe, PagSeguro, etc.) com CNPJ e dados bancários.
2. **Seu backend chama a API do gateway** para criar uma cobrança PIX (ou assinatura recorrente). Eles devolvem o código “Copia e Cola” e um `id` do pagamento.
3. O **cliente paga no app do banco** usando esse código.
4. O **gateway recebe a confirmação do Banco Central** e envia um **webhook** para uma URL que você configurou (ex.: `https://seusite.com/webhook/assinatura`). No body vem algo como `{ "pagamentoId": "...", "statusPagamento": "PAGO" }`.
5. Nosso backend (que você já tem) processa esse webhook: marca o pagamento como PAGO e o tenant como ATIVO.
6. O **gateway transfere o valor para sua conta** (conta que você cadastrou no painel deles), geralmente em D+1 ou conforme o contrato.

Ou seja: **quem coloca o dinheiro na sua conta é o gateway**. Nosso código só “avisa” o sistema que o pagamento foi confirmado e libera o painel.

---

## 2. O que temos hoje (simulação)

- **Gerar PIX:** o barbeiro na tela “Assinatura” clica em “Gerar PIX” → backend cria um registro em `PagamentoAssinatura` e devolve um código PIX **simulado** (não debita nada de verdade).
- **Confirmar pagamento:** como não há banco real, nós **simulamos** o aviso do gateway chamando o webhook manualmente (Postman ou outro cliente HTTP).

---

## 3. Como testar a validação (liberar o painel)

### Passo A: Gerar um PIX de assinatura

1. Faça login no painel (conta de barbeiro).
2. Você deve ser redirecionado para **/dashboard/assinatura**.
3. Clique em **“Gerar PIX Copia e Cola”**.
4. Abra o **DevTools (F12)** → aba **Network** → veja a resposta do `POST .../assinatura/gerar-pix`. No JSON deve vir algo como:
   - `pagamentoId`: um UUID (ex.: `"a1b2c3d4-..."`).
   - `codigoPix`: string do PIX.
   - `valor`: 49.9.

Anote o **`pagamentoId`** (ou copie do payload da resposta).

### Passo B: Simular o “pagamento” (webhook)

1. Abra o **Postman** (ou Insomnia / curl).
2. Crie uma requisição **POST**.
3. URL: `http://localhost:4000/webhook/assinatura`
4. Aba **Body** → **raw** → **JSON**.
5. Conteúdo:

```json
{
  "pagamentoId": "COLE_AQUI_O_PAGAMENTO_ID_DO_PASSO_A",
  "statusPagamento": "PAGO"
}
```

6. Envie a requisição.

Se der certo, a resposta será algo como `{ "recebido": true }` e no console do backend deve aparecer:  
`Assinatura ativada! Pagamento ... aprovado.`

### Passo C: Usar o painel

1. No navegador, na tela de assinatura, clique em **“Já paguei / Atualizar status”**, ou acesse de novo **/dashboard**.
2. O layout chama `GET /assinatura/status` e recebe `podeAcessarPainel: true`.
3. Você deixa de ser redirecionado para a assinatura e pode acessar **Serviços**, **Clientes**, **Agendamentos**, **Financeiro**, etc.

---

## 4. Erro 500 em Serviços / Clientes / Agendamentos

Se **GET /servicos**, **GET /clientes** ou **GET /agendamentos** retornam **500**, em geral é um destes:

1. **Prisma Client desatualizado**  
   - Rode na raiz do projeto:  
     `npx prisma generate`  
   - Reinicie o servidor do backend (porta 4000).  
   - Assim o Prisma passa a conhecer os campos `statusAssinatura` e `dataVencimento` no modelo `Tenant`.

2. **Assinatura não “paga”**  
   - Sem simular o webhook (Passo B acima), o tenant fica com `statusAssinatura !== 'ATIVO'`.  
   - Aí o middleware de paywall pode devolver **403** (ou, em caso de bug, 500).  
   - Com o interceptor do front que redireciona 403 `ASSINATURA_PENDENTE` para **/dashboard/assinatura**, você deve cair na tela de pagamento em vez de ver 500 na lista de serviços/clientes.

3. **Backend não reiniciado**  
   - Depois de `prisma generate`, é obrigatório **reiniciar o processo do backend** para ele carregar o client novo.

Se ainda assim der 500, veja no **terminal do backend** a mensagem de erro completa (stack trace) e confira se é Prisma (campo inexistente) ou outro motivo.

---

## 5. Resumo

| O que você quer              | O que fazer                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| Entender para onde vai o $  | Na produção: gateway (MP, Asaas, etc.) paga sua conta; nosso código só avisa. |
| Testar “pagou assinatura”   | Postman POST `/webhook/assinatura` com `pagamentoId` + `statusPagamento: "PAGO"`. |
| Parar de receber 500        | `npx prisma generate` + reiniciar backend; garantir que o webhook foi chamado.   |
| Redirecionar para assinatura| Front já redireciona em 403 com `codigo: "ASSINATURA_PENDENTE"`.            |
