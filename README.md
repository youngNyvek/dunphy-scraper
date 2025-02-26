<h1><strong>Dunphy Scraper</strong></h1>

<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW1jZHRkaGZsNXZpYWdxeDE2czgzaGlsZ3ZuNG1tMTVvcGk3bXpqayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/geYwtodB9AiI0/giphy.gif" alt="Phil Dunphy">

<blockquote>
  <p>"Você me vê dizendo 'Estou Cansado?' Nunca. Porque não existe 'Cansado' em Dunphy."<br>— Phil Dunphy, <strong>Modern Family</strong></p>
</blockquote>

<p>O <strong>Dunphy Scraper</strong> é um projeto de web scraping desenvolvido com <strong>NestJS</strong>, que utiliza o <strong>Puppeteer</strong> para extrair informações exclusivamente do site <strong>Netimóveis</strong>. Ele envia notificações via <strong>Telegram</strong> sobre imóveis encontrados e armazena os dados em um banco de dados <strong>MongoDB</strong> para evitar duplicação de envios. Além disso, permite configurar dinamicamente o valor máximo desejado para os imóveis.</p>

<hr>

<h2><strong>Pré-requisitos</strong></h2>
<p>Antes de começar, certifique-se de ter os seguintes softwares instalados no seu sistema:</p>
<ol>
  <li><strong>Node.js</strong> (versão 18 ou superior)<br><a href="https://nodejs.org/">Download Node.js</a></li>
  <li><strong>Docker</strong> e <strong>Docker Compose</strong><br><a href="https://www.docker.com/products/docker-desktop">Download Docker</a></li>
  <li><strong>Git</strong> (para clonar o repositório)<br><a href="https://git-scm.com/">Download Git</a></li>
</ol>

<hr>

<h2><strong>Instalação</strong></h2>
<h3><strong>1. Clone o Repositório</strong></h3>
<pre><code>git clone https://github.com/seu-usuario/dunphy-scraper.git
cd dunphy-scraper
</code></pre>

<h3><strong>2. Instale as Dependências</strong></h3>
<p>Certifique-se de estar no diretório do projeto e execute:</p>
<pre><code>npm install
</code></pre>

<hr>

<h2><strong>Configuração</strong></h2>
<h3><strong>1. Variáveis de Ambiente</strong></h3>
<p>Crie um arquivo <code>.env</code> na raiz do projeto e adicione as seguintes variáveis de ambiente:</p>
<pre><code># Token do Bot do Telegram
TELEGRAM_KEY=seu_token_do_bot

# ID do Chat ou Grupo no Telegram
CHAT_ID=-123456789

# URL do site Netimóveis
URL=https://www.netimoveis.com/imoveis/aluguel/

# Configuração do MongoDB
MONGO_URI=mongodb://mongodb:27017/imoveisdb
</code></pre>

<h4><strong>Como Obter as Variáveis de Ambiente</strong></h4>
<ol>
  <li><strong>Token do Bot do Telegram (<code>TELEGRAM_KEY</code>)</strong>
    <ul>
      <li>Crie um bot no Telegram usando o <a href="https://core.telegram.org/bots#botfather">BotFather</a>.</li>
      <li>Após criar o bot, você receberá um token exclusivo. Use-o aqui.</li>
    </ul>
  </li>
  <li><strong>Chat ID do Telegram (<code>CHAT_ID</code>)</strong>
    <ul>
      <li>Adicione o bot ao grupo ou envie uma mensagem para ele.</li>
      <li>Acesse a API do Telegram para obter o Chat ID:
        <pre><code>curl "https://api.telegram.org/bot&lt;SEU_TELEGRAM_KEY&gt;/getUpdates"
        </code></pre>
      </li>
      <li>Substitua <code>&lt;SEU_TELEGRAM_KEY&gt;</code> pelo token do bot e copie o valor do campo <code>"id"</code> dentro de <code>"chat"</code>.</li>
    </ul>
  </li>
  <li><strong>URL do Site Netimóveis (<code>URL</code>)</strong>
    <ul>
      <li>Por padrão, use a URL base do Netimóveis para aluguel:
        <pre><code>https://www.netimoveis.com/imoveis/aluguel/
        </code></pre>
      </li>
      <li>Você pode ajustar a URL para filtrar por cidade, bairro ou outras opções diretamente no site.</li>
    </ul>
  </li>
  <li><strong>URI do MongoDB (<code>MONGO_URI</code>)</strong>
    <ul>
      <li>No desenvolvimento local, use <code>mongodb://mongodb:27017/imoveisdb</code> (configurado no Docker Compose).</li>
      <li>Em produção, substitua pelo URI do MongoDB hospedado.</li>
    </ul>
  </li>
</ol>

<hr>

<h2><strong>Executando o Projeto</strong></h2>
<h3><strong>1. Iniciar os Contêineres</strong></h3>
<p>O projeto usa o Docker para rodar o banco de dados MongoDB. Para iniciar os contêineres, execute:</p>
<pre><code>docker-compose up --build
</code></pre>
<p>Isso iniciará:</p>
<ul>
  <li>O banco de dados MongoDB na porta <code>27017</code>.</li>
  <li>O serviço da aplicação NestJS na porta <code>3000</code>.</li>
</ul>

<h3><strong>2. Verificar Logs</strong></h3>
<p>Os logs dos serviços serão exibidos no terminal. Certifique-se de que não há erros e que o servidor está rodando corretamente.</p>

<hr>

<h2><strong>Rotas Disponíveis</strong></h2>
<h3><strong>1. Configurações</strong></h3>
<h4><strong>Obter o Valor Atual Configurado</strong></h4>
<ul>
  <li><strong>Endpoint:</strong> <code>GET /configuracao/valor</code></li>
  <li><strong>Descrição:</strong> Retorna o valor atual configurado no banco de dados.</li>
  <li><strong>Exemplo de Resposta:</strong>
    <pre><code>{
"id": "preco-alvo",
"valor": 1500
}
    </code></pre>
  </li>
</ul>

<h4><strong>Atualizar o Valor Configurado</strong></h4>
<ul>
  <li><strong>Endpoint:</strong> <code>POST /configuracao/valor</code></li>
  <li><strong>Descrição:</strong> Atualiza o valor configurado no banco de dados.</li>
  <li><strong>Corpo da Requisição:</strong>
    <pre><code>{
"valor": 1800
}
    </code></pre>
  </li>
  <li><strong>Exemplo de Resposta:</strong>
    <pre><code>{
"message": "Valor atualizado para R$1800"
}
    </code></pre>
  </li>
</ul>

<hr>

<h2><strong>Monitoramento</strong></h2>
<h3><strong>Verificar os Contêineres Ativos</strong></h3>
<p>Para verificar se os contêineres estão rodando, use:</p>
<pre><code>docker ps
</code></pre>

<h3><strong>Acompanhar Logs</strong></h3>
<p>Para visualizar os logs em tempo real:</p>
<pre><code>docker-compose logs -f
</code></pre>

<hr>

<h2><strong>Parar os Contêineres</strong></h2>
<p>Se quiser parar os contêineres, execute:</p>
<pre><code>docker-compose down
</code></pre>

<hr>

<h2><strong>Estrutura do Projeto</strong></h2>
<pre><code>dunphy-scraper/
├── src/
│   ├── app.module.ts         # Módulo principal do NestJS
│   ├── main.ts               # Arquivo de entrada da aplicação
│   ├── scraping/             # Lógica de scraping
│   │   ├── scraping.service.ts
│   │   └── scraping.module.ts
│   ├── database/             # Conexão e modelos do MongoDB
│   │   ├── database.module.ts
│   │   ├── database.service.ts
│   │   ├── imovel.schema.ts  # Esquema para imóveis encontrados
|   |   └── configuracao/         # Rotas para gerenciar configurações
│   |       ├── configuracao.controller.ts
|   |       └── configuracao.schema.ts # Esquema para configurações
│   ├── telegram/             # Integração com o Telegram
│   │   ├── telegram.service.ts
│   │   └── telegram.module.ts
│   
├── .env.example              # Variáveis de ambiente (criar .env)
├── docker-compose.yml        # Configuração do Docker Compose
├── Dockerfile                # Configuração do Docker para a aplicação
├── package.json              # Dependências do projeto
└── README.md                 # Documentação do projeto
</code></pre>

<hr>

<h2><strong>Tecnologias Utilizadas</strong></h2>
<ul>
  <li><strong>NestJS:</strong> Framework para construção de APIs escaláveis.</li>
  <li><strong>Puppeteer:</strong> Biblioteca para automação de navegadores.</li>
  <li><strong>MongoDB:</strong> Banco de dados não relacional para persistência de dados.</li>
  <li><strong>Docker:</strong> Ferramenta para containerização.</li>
  <li><strong>Telegram Bot API:</strong> Para envio de notificações.</li>
</ul>

<hr>

<h2><strong>Contribuindo</strong></h2>
<ol>
  <li>Faça um fork do repositório.</li>
  <li>Crie uma branch para sua feature:
    <pre><code>git checkout -b minha-feature
    </code></pre>
  </li>
  <li>Commit suas alterações:
    <pre><code>git commit -m "Adiciona nova feature"
    </code></pre>
  </li>
  <li>Envie para o repositório remoto:
    <pre><code>git push origin minha-feature
    </code></pre>
  </li>
  <li>Abra um Pull Request.</li>
</ol>

<hr>

<h2><strong>Licença</strong></h2>
<p>Este projeto está licenciado sob a licença MIT. Consulte o arquivo <code>LICENSE</code> para mais detalhes.</p>
