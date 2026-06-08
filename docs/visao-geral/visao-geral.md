# 📄 Documento de Visão Geral — Sistema de Gestão de Leads  
## Projeto: 1000 Valle Multimarcas

---

# 1. Introdução

Este documento apresenta a visão geral do **Sistema de Gestão de Leads com Dashboard Analítico**, desenvolvido como parte do Projeto Integrador (ABP) do 3º semestre do curso de Desenvolvimento de Software Multiplataforma (DSM) da Fatec Jacareí.

O sistema foi idealizado para atender às necessidades da **1000 Valle Multimarcas**, uma revendedora de veículos com múltiplas unidades, visando melhorar o gerenciamento de leads, negociações e indicadores estratégicos.

---

# 2. Descrição do Problema

A empresa recebe contatos de potenciais clientes (*leads*) por diferentes canais de comunicação, tais como:

## Canais de Entrada
- Visitas presenciais;
- Telefone;
- WhatsApp;
- Instagram;
- Formulários digitais.

## Desafios Identificados
Atualmente, a empresa enfrenta dificuldades relacionadas a:

- Registro e associação consistente entre leads e clientes;
- Vinculação de leads às lojas e aos atendentes responsáveis;
- Monitoramento da evolução das negociações;
- Controle de estágios e status de atendimento;
- Consolidação de indicadores gerenciais e métricas de desempenho.

---

# 3. Solução Proposta

O projeto consiste no desenvolvimento de uma plataforma CRM (*Customer Relationship Management*) construída do zero, contemplando funcionalidades operacionais, gerenciais e analíticas.

## Funcionalidades Principais

### Gestão Operacional
- Cadastro de leads e clientes;
- Acompanhamento do ciclo de vida das negociações;
- Controle de estágios de atendimento;
- Histórico de interações e movimentações.

### Controle de Acesso (RBAC)
Implementação de controle de acesso baseado em papéis (*Role-Based Access Control*), contendo os seguintes perfis:

- Atendente;
- Gerente de Loja;
- Gerente Geral;
- Administrador.

### Dashboards Analíticos
Visualização de indicadores estratégicos, incluindo:

- Taxa de conversão de leads;
- Distribuição por origem;
- Distribuição por nível de importância;
- Indicadores temporais de desempenho;
- Métricas consolidadas por loja e equipe.

### Segurança e Integridade
- Validação centralizada das regras de negócio;
- Controle de autorização aplicado exclusivamente no backend;
- Garantia de integridade e consistência dos dados.

---

# 4. Objetivos do Projeto

O sistema possui os seguintes objetivos principais:

- Fornecer uma modelagem relacional consistente e aderente às necessidades do negócio;
- Aplicar conceitos reais utilizados no mercado de desenvolvimento de software;
- Garantir autonomia acadêmica e prática aos integrantes do projeto;
- Implementar indicadores analíticos e análises temporais;
- Desenvolver uma arquitetura escalável, segura e organizada.

---

# 5. Stakeholders e Perfis de Usuário

O sistema contempla diferentes níveis organizacionais, cada um com permissões específicas.

## 1. Atendente
Responsável por:
- Gerenciar leads;
- Cadastrar clientes;
- Acompanhar negociações sob sua responsabilidade.

## 2. Gerente de Loja
Responsável por:
- Supervisionar a equipe local;
- Acompanhar indicadores da unidade;
- Visualizar dashboards consolidados da loja.

## 3. Gerente Geral
Responsável por:
- Acompanhar indicadores globais;
- Supervisionar todas as unidades e equipes;
- Visualizar dashboards gerais da empresa.

## 4. Administrador
Responsável por:
- Gerenciar usuários e permissões;
- Administrar equipes;
- Acompanhar logs e auditorias do sistema.

---

# 6. Tecnologias Utilizadas

Para atender aos requisitos funcionais e não funcionais do projeto, serão utilizadas as seguintes tecnologias:

| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript |
| Backend | Node.js + TypeScript |
| API | REST API |
| Banco de Dados | PostgreSQL |
| Infraestrutura | Docker e Docker Compose |

---

# 7. Arquitetura e Metodologia

O desenvolvimento do sistema segue:

- Metodologia Ágil;
- Arquitetura em camadas;
- Princípios de separação de responsabilidades;
- Aplicação de padrões de projeto GoF (*Gang of Four*);
- Boas práticas de segurança e organização de código.

---

# 8. Considerações Finais

O projeto busca unir conhecimentos acadêmicos e práticas reais de mercado, proporcionando uma solução robusta para gestão de leads e acompanhamento comercial da empresa.

Além de atender às necessidades operacionais da **1000 Valle Multimarcas**, o sistema também serve como base prática para aplicação de conceitos de engenharia de software, banco de dados, arquitetura de sistemas e análise de indicadores.
