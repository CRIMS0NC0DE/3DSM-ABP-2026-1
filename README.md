# 🚗 1000 Valle Multimarcas - Gestão de Leads & Dashboard

## 📖 Sobre o Projeto
Este sistema é um projeto acadêmico desenvolvido para o **3º semestre de DSM da Fatec Jacareí**.

O objetivo é criar uma plataforma completa para a **1000 Valle Multimarcas**, permitindo gerenciar todo o fluxo de vendas — desde a captação de leads até a análise de conversão por meio de dashboards analíticos.

---

## 🛠️ Tecnologias Obrigatórias (RP01)

- **Frontend:** React com TypeScript  
- **Backend:** Node.js com TypeScript  
- **Banco de Dados:** PostgreSQL  
- **Infraestrutura:** Docker e Docker Compose  

---

## 🏗️ Arquitetura e Padrões (RNF11, RNF12)

O sistema segue uma arquitetura em camadas, garantindo **baixo acoplamento** e **alta coesão**.

### 🔹 Camadas da Aplicação

1. **Camada de Apresentação**
   - Frontend em React  
   - Controllers no Backend  

2. **Camada de Aplicação / Serviços**
   - Regras de negócio  

3. **Camada de Acesso a Dados**
   - Repositórios / DAO  
   - Comunicação com o banco de dados  

4. **Camada de Domínio**
   - Entidades  
   - Modelos de negócio  

---

## 🧩 Padrões de Projeto (GoF) (RNF10)

- **Singleton**
  - Utilizado na conexão com o banco de dados (instância única)

- **Factory Method**
  - Utilizado para criação e diferenciação dos perfis de usuários (RBAC)

---

## 🔐 Segurança e Regras de Negócio (RNF02)

### 🔑 Autenticação
- Login com e-mail e senha  
- Geração de token JWT  

### 🔒 Criptografia
- Senhas protegidas com hash usando bcrypt  

### 🛡️ Autorização (RBAC)
Perfis de acesso:
- Atendente  
- Gerente  
- Gerente Geral  
- Administrador  

### ✅ Validação
- Todas as regras e permissões são validadas exclusivamente no backend  

---

## 🌐 Acesso

- **API:** http://localhost:3333  
- **Frontend:** http://localhost:3000  

---

## 📅 Cronograma de Sprints

### 🚀 Sprint 1 (24/03 a 14/04)
- Fundação do projeto  
- Autenticação  
- Setup inicial  

### 🚀 Sprint 2 (15/04 a 21/05)
- Operação de Leads  
- Negociações  

### 🚀 Sprint 3 (a definir)
- Dashboards analíticos  
- Auditoria  

---

## 👥 Equipe e Contatos

- **Product Owner** Vinícius de Oliveira - [ViniciusLedro (https://github.com/ViniciusLedro) 
- **Scrum Master** Márcio Bueno - [MarcioBuenoo](https://github.com/MarcioBuenoo)
- **Dev. Team:** Davi Snaider - [davisnaider06](https://github.com/davisnaider06)
- **Dev. Team:** Eric França - [EricFranca96](https://github.com/EricFranca90)
- **Dev. Team:** Henrique Pinho - [rickshf](https://github.com/rickshf)
- **Dev. Team:** Pedro Rosa -   
- **Focal Point:** Prof. Arley Ferreira de Souza - [arleysouza](https://github.com/arleysouza) 
- **Parceiro:** 1000 Valle Multimarcas  
