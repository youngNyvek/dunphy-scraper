# Use a imagem oficial do Node.js como base
FROM node:18

# Defina o diretório de trabalho dentro do container
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
 libnss3 \
 libx11-xcb1 \
 libxcomposite1 \
 libxrandr2 \
 libxi6 \
 libatk1.0-0 \
 libatk-bridge2.0-0 \
 libcups2 \
 libdrm2 \
 libdbus-1-3 \
 libxdamage1 \
 libgbm1 \
 libasound2 \
 libpangocairo-1.0-0 \
 libpango-1.0-0 \
 libgtk-3-0 \
 fonts-liberation \
 libjpeg62-turbo \
 libwayland-client0 \
 libwayland-cursor0 \
 libwayland-egl1 \
 xdg-utils \
 && rm -rf /var/lib/apt/lists/*


# Copie os arquivos de configuração e instale as dependências
COPY package*.json ./
RUN npm install

# Copie o restante do código do projeto
COPY . .

# Exponha a porta padrão do NestJS
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "run", "start"]