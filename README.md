# Desafio Técnico – Perfil de Usuário

Este projeto consiste em uma aplicação web full-stack para gerenciar um perfil de usuário, permitindo a exibição, edição e salvamento de dados em um banco de dados MySQL. A interface é responsiva e utiliza tecnologias modernas para uma experiência de usuário fluida.

## Objetivo

Criar uma interface de perfil de usuário com possibilidade de edição e salvamento de dados em um banco de dados MySQL.

## Funcionalidades Implementadas

* **Exibição de Informações do Usuário:** A página mostra a foto de perfil, nome completo, idade, endereço (rua, bairro, estado) e biografia do usuário.
* **Formulário de Edição:** Permite editar todos os dados do perfil, com validação básica no frontend e backend.
* **Salvar/Atualizar Dados:** As alterações são enviadas para o backend e persistidas no banco de dados MySQL.
* **Interface Responsiva:** A aplicação se adapta bem a diferentes tamanhos de tela, proporcionando uma boa experiência tanto em dispositivos móveis quanto em desktops.
* **Validação:** A aplicação realiza validação no frontend (idade, nome) e no backend (nome, idade) para garantir a integridade dos dados.
* **Feedback ao Usuário:** O sistema exibe mensagens claras de sucesso ou erro após cada operação de salvar.

## Tecnologias Utilizadas

* **Frontend:** React.js (com Vite)
* **Estilização:** CSS (padrão)
* **Backend:** Node.js (com o framework Express.js)
* **Banco de Dados:** MySQL

## Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina.

### Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

* **Node.js:** (versão LTS recomendada, ex: v18.x ou v20.x)
* **npm:** (gerenciador de pacotes do Node.js, vem com o Node.js)
* **MySQL Server:** (ex: MySQL 8.0, XAMPP, WAMP, Dockerized MySQL)
* **Git:** (para clonar o repositório)

### 1. Clonar o Repositório

Primeiro, clone este repositório para sua máquina local.

```bash
git clone https://github.com/jbrafael/user-profile-challenge.git
cd user-profile-challenge