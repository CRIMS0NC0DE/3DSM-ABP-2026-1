# 🏃‍♂️ Documentação do Sprint Backlog (Evolução Técnica)

Este documento detalha o planejamento, a execução e o histórico das Sprints do projeto. Enquanto o **Product Backlog** traz uma visão macro e estratégica do produto, o **Sprint Backlog** reflete o compromisso técnico do time dentro de ciclos de desenvolvimento fechados, focados na entrega contínua de software funcional.

As sprints foram divididas de forma incremental, garantindo que a base técnica fosse consolidada antes da expansão das regras de negócio e dashboards analíticos.

---

## 🗺️ Mapa de Execução das Sprints

```
[ BACKLOG GERAL ]
       │
       ├──► SPRINT 1 (Épico CRC0-27) ──► Infraestrutura, Docker, JWT e Protótipo (100%)
       │
       ├──► SPRINT 2 (Épico CRC0-31) ──► Core do Funil, Regras de Negócio e Estados (100%)
       │
       └──► SPRINT 3 (Épico CRC0-70) ──► Dashboards, Logs de Auditoria e UML (Em Andamento)
```

| Sprint | Foco Estratégico | ID do Épico | Status | Métrica de Conclusão |
| :---: | :--- | :---: | :---: | :---: |
| **Sprint 1** | Fundação do Projeto, Autenticação e Setup de Ambiente | `CRC0-27` | 🟢 Concluída | 100% dos Itens Entregues |
| **Sprint 2** | Gestão Operacional de Leads e Controle de Negociações | `CRC0-31` | 🟢 Concluída | 100% dos Itens Entregues |
| **Sprint 3** | Inteligência Analítica, Auditoria e Documentação Final | `CRC0-70` | 🟡 Em Progresso | 25% dos Itens Entregues |

---

## 🏁 Detalhamento Técnico dos Ciclos

### 📦 Sprint 1: Fundação, Infraestrutura & Segurança (`CRC0-27`)
* **Objetivo da Sprint:** Estabelecer a arquitetura base isolada por containers, modelar a persistência inicial e fechar o ciclo de segurança básico (autenticação e proteção de rotas).
* **Meta de Entrega:** Uma aplicação com ambiente configurado via Docker, fluxo de login com validação de token JWT e prototipagem visual mapeada para guiar o frontend.

#### Itens do Backlog da Sprint 1:
| ID do Item | Tipo | Descrição do Trabalho / História de Usuário | Responsável | Estado |
| :--- | :---: | :--- | :---: | :---: |
| `CRC0-28` | Story | Configuração de Ambiente Docker e Estrutura de Dados Base | MB | 🟢 CONCLUÍDO |
| `CRC0-29` | Story | Implementação de Login e Controle de Acesso via JWT (Backend) | DM | 🟢 CONCLUÍDO |
| `CRC0-30` | Story | Interface de Login e Proteção de Rotas de Navegação (Frontend) | U | 🟢 CONCLUÍDO |
| `CRC0-91` | Story | Criação de protótipo de alta fidelidade no FIGMA para a plataforma | TN | 🟢 CONCLUÍDO |
| `CRC0-97` | Story | Definição da estrutura e árvore de Páginas da Aplicação | VP | 🟢 CONCLUÍDO |
| `CRC0-104`| Story | Interface inicial do Fluxo de Leads e Kanban (Frontend) | TN | 🟢 CONCLUÍDO |
| `CRC0-47` | Story | Aplicação de Padrões de Projeto e estruturação da Documentação | U | 🟢 CONCLUÍDO |

🔒 **Mecanismo de Revisão (Sprint Review 1):**
* O ambiente de desenvolvimento em container isolado mitigou problemas de divergência de ambiente local.
* O fluxo de login intercepta rotas não autorizadas com sucesso. Com base no feedback da apresentação, foram mapeadas melhorias de UX na visualização do fluxo de leads para o ciclo seguinte.

---

### 💼 Sprint 2: Domínio do Negócio & Fluxo de Negociação (`CRC0-31`)
* **Objetivo da Sprint:** Implementar o motor operacional de propostas comerciais e o gerenciamento dos clientes. O foco principal foi o controle de estados e o isolamento rígido de permissões por perfil de usuário.
* **Meta de Entrega:** Funil de vendas funcional com transições de estágios seguras e um painel operacional responsivo consumindo a API.

#### Itens do Backlog da Sprint 2:
| ID do Item | Tipo | Descrição do Trabalho / História de Usuário | Responsável | Estado |
| :--- | :---: | :--- | :---: | :---: |
| `CRC0-51` | Story | Cadastro e Gerenciamento Avançado de Leads e Clientes vinculados | U | 🟢 CONCLUÍDO |
| `CRC0-56` | Story | Controle de Acesso, Autenticação de Escopos e Isolamento por Perfil | DM | 🟢 CONCLUÍDO |
| `CRC0-61` | Story | Gestão Dinâmica de Estágios, Status e Importância da Negociação | TN | 🟢 CONCLUÍDO |
| `CRC0-66` | Story | Painel Operacional e Implementação de Design Patterns de Comportamento | MB | 🟢 CONCLUÍDO |
| `CRC0-105`| Story | Ajustes e refinamentos no Frontend de acordo com a Sprint Review 1 | TN | 🟢 CONCLUÍDO |

⚙️ **Mecanismo de Revisão (Sprint Review 2):**
* A arquitetura em camadas permitiu isolar as regras complexas de mudança de status das propostas (utilizando padrões de projeto arquiteturais).
* O isolamento de registros por perfil foi testado exaustivamente, garantindo conformidade com regras de visibilidade de dados.

---

### 📊 Sprint 3: Inteligência de Dados, Auditoria & Consolidação (`CRC0-70`)
* **Objetivo da Sprint:** Trazer inteligência estratégica e segurança operacional para a plataforma. Isso inclui a visualização gráfica de conversões, geração de trilha de auditoria transparente (logs) e fechamento dos diagramas arquiteturais.
* **Meta de Entrega:** Dashboards com filtros temporais consolidados, logs guardados em banco de dados e engenharia de software documentada em diagramas UML.

#### Itens do Backlog da Sprint 3 (Ciclo Atual):
| ID do Item | Tipo | Descrição do Trabalho / História de Usuário | Responsável | Estado |
| :--- | :---: | :--- | :---: | :---: |
| `CRC0-85` | Story | Consolidação de Artefatos UML e Documentação Arquitetural Técnica | PR | 🟢 CONCLUÍDO |
| `CRC0-71` | Story | Implementação de Indicadores Gráficos de Conversão e Desempenho | U | ⚪ A FAZER |
| `CRC0-76` | Story | Desenvolvimento de Filtros de Período Customizado com Trava de Segurança | U | ⚪ A FAZER |
| `CRC0-81` | Story | Registro e Visualização de Logs de Operações para Auditoria | U | ⚪ A FAZER |

---

## 🛠️ Definição de Pronto (Definition of Done - DoD)
Para que um item saia do Sprint Backlog e seja considerado **Concluído**, ele deve obrigatoriamente cumprir os seguintes critérios:
1. **Código Limpo:** Seguir os padrões arquiteturais estabelecidos no projeto e passar por análise estática.
2. **Revisão por Pares (Pull Request):** Ter pelo menos uma aprovação de outro desenvolvedor do time.
3. **Ambiente Isolado:** Funcionar perfeitamente dentro dos containers Docker sem depender de configurações manuais da máquina local.
4. **Sem Regressões:** O novo código não deve quebrar funcionalidades legadas (como autenticação JWT ou fluxo básico de leads).
