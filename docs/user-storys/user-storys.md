# 📑 Especificação de Histórias de Usuário (User Stories) e Critérios de Aceite

Este documento contém o detalhamento das **Histórias de Usuário** e seus respectivos **Critérios de Aceite**, estruturados utilizando o padrão de mercado **BDD (Behavior-Driven Development)** através da estrutura *Dado-Quando-Então (Given-When-Then)*.

---

## 🚀 Épico 1: Fundação do Projeto, Autenticação e Setup de Ambiente (`CRC0-27`)

### 🔑 Itens: `CRC0-30` e `CRC0-29` — Autenticação e Proteção de Rotas (JWT)

> **História de Usuário:**
> - **Como um:** Usuário cadastrado da plataforma  
> - **Eu quero:** Me autenticar fornecendo meu e-mail e senha informando credenciais válidas  
> - **Para que:** Eu possa acessar as funcionalidades restritas do sistema com segurança.

#### ⚙️ Critérios de Aceite:

* **Cenário 1: Login realizado com sucesso**
    * **Dado** que o usuário está na página de login e insere um e-mail e senha válidos;
    * **Quando** clicar no botão "Entrar";
    * **Então** o sistema deve criptografar e validar a senha no banco de dados, gerar um token JWT assinado e armazená-lo com segurança no frontend;
    * **E** redirecionar o usuário para o Painel Operacional de Leads.
* **Cenário 2: Tentativa com credenciais inválidas**
    * **Dado** que o usuário insere um e-mail não cadastrado ou senha incorreta;
    * **Quando** tentar submeter o formulário;
    * **Então** o sistema deve retornar um erro HTTP 401 (Não Autorizado) com uma mensagem amigável: *"E-mail ou senha incorretos."* e manter o usuário na mesma página.
* **Cenário 3: Bloqueio de rota sem Token**
    * **Dado** que um usuário anônimo tenta acessar diretamente a URL `/dashboard` ou `/leads`;
    * **Quando** a requisição for interceptada pelos middlewares de rota;
    * **Então** o sistema deve negar o acesso e redirecioná-lo imediatamente para a tela de login.

---

### 🐳 Item: `CRC0-28` — Configuração de Ambiente Docker e Estrutura de Dados

> **História de Usuário:**
> - **Como um:** Desenvolvedor do projeto  
> - **Eu quero:** Subir todo o ecossistema da aplicação (Frontend, Backend, Banco de Dados) com um único comando  
> - **Para que:** O ambiente seja idêntico em qualquer máquina e evite erros de configuração local.

#### ⚙️ Critérios de Aceite:

* **Cenário 1: Inicialização do ecossistema via Compose**
    * **Dado** que o desenvolvedor clonou o repositório e configurou o arquivo `.env`;
    * **Quando** executar o comando `docker compose up --build`;
    * **Então** o Docker deve criar as imagens e inicializar os containers isolados para a aplicação web, API e banco de dados.
* **Cenário 2: Persistência do banco de dados**
    * **Dado** que os containers estão rodando e dados foram inseridos na base;
    * **Quando** o container do banco de dados for derrubado e reiniciado;
    * **Então** as informações inseridas anteriormente devem ser mantidas através da utilização de *Docker Volumes*.

---

## 💼 Épico 2: Gestão Operacional de Leads e Controle de Negociações (`CRC0-31`)

### 📋 Item: `CRC0-51` — Cadastro e Gerenciamento de Leads e Clientes

> **História de Usuário:**
> - **Como um:** Operador ou vendedor  
> - **Eu quero:** Cadastrar um novo lead com dados de contato, empresa e valor estimado  
> - **Para que:** Eu possa iniciar o fluxo de negociação comercial.

#### ⚙️ Critérios de Aceite:

* **Cenário 1: Cadastro válido de lead**
    * **Dado** que o operador preencheu os campos obrigatórios (*Nome do Lead, E-mail, Telefone, Nome da Empresa e Valor Estimado*);
    * **Quando** clicar em "Salvar Lead";
    * **Então** o sistema deve registrar o lead no banco de dados com a data de criação atual e definir seu estágio inicial por padrão como *Prospecção*.
* **Cenário 2: Validação de campos obrigatórios**
    * **Dado** que o operador deixou o campo "Nome do Lead" ou "E-mail" em branco;
    * **Quando** tentar salvar;
    * **Então** o sistema deve impedir o envio, destacar o campo inválido em vermelho e exibir um aviso em tempo real.

---

### 🗂️ Itens: `CRC0-61` e `CRC0-66` — Gestão de Estágios (Funil) e Painel Operacional

> **História de Usuário:**
> - **Como um:** Gerente de vendas  
> - **Eu quero:** Alterar o estágio de um lead através de um painel Kanban visual ou formulário  
> - **Para que:** O progresso da negociação seja atualizado e reflita o estado real da venda.

#### ⚙️ Critérios de Aceite:

* **Cenário 1: Evolução bem-sucedida do estágio**
    * **Dado** que um lead está no estágio *Contato Inicial*;
    * **Quando** o usuário arrastar o card para o estágio *Proposta Enviada* ou atualizar via formulário;
    * **Então** o sistema deve disparar uma requisição PATCH para atualizar o estado da negociação no banco de dados;
    * **E** recalcular instantaneamente os totais financeiros de cada coluna no painel Kanban do frontend.

---

### 🛡️ Item: `CRC0-56` — Controle de Acesso e Isolamento de Dados por Perfil

> **História de Usuário:**
> - **Como um:** Administrador do sistema  
> - **Eu quero:** Garantir que vendedores comuns vejam apenas os próprios leads, enquanto gerentes vejam todos  
> - **Para que:** Haja segurança de dados e privacidade comercial entre as carteiras.

#### ⚙️ Critérios de Aceite:

* **Cenário 1: Vendedor visualizando a listagem**
    * **Dado** que o usuário autenticado possui o perfil `ROLE_VENDEDOR`;
    * **Quando** ele carregar a listagem de leads;
    * **Então** o backend deve aplicar um filtro automático na query (`owner_id === user_id`) retornando apenas as suas respectivas negociações.
* **Cenário 2: Gerente visualizando a listagem**
    * **Dado** que o usuário autenticado possui o perfil `ROLE_GERENTE`;
    * **Quando** ele carregar a mesma página;
    * **Então** o sistema não deve aplicar restrições de propriedade, exibindo os registros de toda a equipe de forma unificada.

---

## 📊 Épico 3: Inteligência Analítica, Auditoria e Documentação Final (`CRC0-70`)

### 📈 Itens: `CRC0-71` e `CRC0-76` — Indicadores de Conversão e Filtros Customizados

> **História de Usuário:**
> - **Como um:** Diretor de operações  
> - **Eu quero:** Filtrar os gráficos de conversão selecionando um período específico (Início e Fim)  
> - **Para que:** Eu possa mensurar a taxa de fechamento de negócios e o desempenho em cada mês.

#### ⚙️ Critérios de Aceite:

* **Cenário 1: Aplicação de filtro válido**
    * **Dado** que o usuário selecionou o período de `01/03/2026` a `31/03/2026`;
    * **Quando** clicar em "Aplicar Filtro";
    * **Então** os gráficos de pizza e barras devem se reajustar exibindo apenas as métricas de conversão criadas/fechadas dentro desse intervalo de dias.
* **Cenário 2: Trava de segurança para períodos inválidos**
    * **Dado** que o usuário insere uma data final que é *anterior* à data inicial (ex: início em `10/04/2026` e fim em `01/04/2026`);
    * **Quando** tentar submeter o filtro;
    * **Então** o sistema deve impedir a requisição, exibindo um aviso: *"A data inicial não pode ser maior que a data final."*

---

### 📝 Item: `CRC0-81` — Registro e Visualização de Logs de Operações (Auditoria)

> **História de Usuário:**
> - **Como um:** Auditor de segurança  
> - **Eu quero:** Que o sistema grave um log imutável toda vez que um lead tiver o status ou valor alterado  
> - **Para que:** Seja possível rastrear quem realizou modificações críticas em caso de divergências.

#### ⚙️ Critérios de Aceite:

* **Cenário 1: Geração automática de log**
    * **Dado** que o usuário `Vendedor_A` alterou o valor de um lead de `$5.000` para `$12.000`;
    * **Quando** a operação for processada com sucesso no banco de dados;
    * **Então** uma tabela secundária de auditoria deve salvar automaticamente o registro contendo: `ID do Usuário`, `Ação: UPDATE`, `Campo alterado: valor_estimado`, `Valor Antigo: 5000`, `Valor Novo: 12000` e o `Timestamp` exato da ação.
* **Cenário 2: Imutabilidade do log**
    * **Dado** que um log de auditoria foi gerado;
    * **Quando** qualquer usuário tentar acessar as rotas de escrita (PUT/DELETE) para alterar esse registro;
    * **Então** a API deve barrar e retornar um erro HTTP 403 (Proibido), garantindo que os logs sejam estritamente persistidos no formato *append-only*.
