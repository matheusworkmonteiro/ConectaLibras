# ConectaLibras 🐱💙

Protótipo de web app educacional para o projeto de Iniciação Científica **ConectaLibras**, da Escola Pedro Apóstolo (FECCI — 7º ano).

## Abrir no VS Code

1. Extraia a pasta `ConectaLibras` do arquivo ZIP.
2. Abra a pasta inteira no Visual Studio Code (`Arquivo > Abrir Pasta`).
3. Instale a extensão **Live Server** (opcional, mas recomendada).
4. Clique com o botão direito em `index.html` e escolha **Open with Live Server**. Também funciona abrindo `index.html` diretamente no navegador.

Sem instalação de pacotes, Node.js ou conexão obrigatória a um banco de dados.

## Funcionalidades

- Catálogo de vocabulário por contexto escolar, com busca e filtros.
- Fichas das palavras e espaço para vídeos demonstrativos, com controle de velocidade.
- Flashcards de palavras e significados em português.
- Quizzes com correção, pontuação e histórico.
- Situações escolares para refletir sobre inclusão.
- Listas de vocabulário personalizadas e opção de impressão.
- Painel de progresso por categoria, respostas e pontos.
- Área do professor para adicionar palavras e vincular vídeos.
- Mascote original vetorial: gatinho branco com azul.
- Interface responsiva para celular e computador.

## Vídeos de Libras — atenção

**Não há vídeos demonstrativos pré-carregados**: a representação dos sinais precisa ser correta e validada por pessoas fluentes, preferencialmente da comunidade surda. Na **Área do professor**, escolha a palavra e vincule um URL direto para arquivo de vídeo MP4/WebM. É possível testar um vídeo do computador durante a sessão; esse arquivo local **não permanece disponível após recarregar**.

Não presuma que um ícone ou emoji represente a configuração correta do sinal. Os quizzes e flashcards abordam o **vocabulário em português**, não a produção dos sinais.

## Dados e limites

O estado é salvo no `localStorage` do navegador: listas, palavras criadas, quizzes e progresso. É uma demonstração local, **não** um sistema de contas, pesquisa multiusuário ou monitoramento remoto. O nome informado é apenas local. Para a etapa de coleta científica com participantes, planeje consentimento, privacidade e uma infraestrutura segura antes de registrar dados pessoais.

Arquivos: `index.html` (estrutura), `style.css` (identidade visual), `app.js` (funcionamento) e `assets/gatinho.svg` (mascote).
