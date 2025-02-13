FROM node:18

# Atualiza os repositórios e instala o FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package.json pnpm-lock.yaml* ./

# Instala o pnpm globalmente e as dependências do projeto
RUN npm install -g pnpm && pnpm install

# Copia todo o restante do código
COPY . .

# Compila o projeto TypeScript
RUN pnpm build

# Expõe a porta definida no app (3000)
EXPOSE 3000

# Inicia o app
CMD ["pnpm", "start"]