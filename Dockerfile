# Define a versão do node.js
FROM node:24

# Define o diretório de trabalho do contêiner
WORKDIR /app

# Copia o arquivo de dependências para dentro do contêiner
COPY package.json .

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos para dentro do contêiner
COPY . .

# Gera o Prisma Client dentro do contêiner (versão Linux)
RUN npx prisma generate

# Compila o TypeScript para a pasta dist
RUN npm run build

# Copia o motor do Prisma para junto do código compilado
RUN cp src/generated/prisma/*.node dist/src/generated/prisma/

# Expor a porta 3000, que vai ser a porta usada pela aplicação
EXPOSE 3000

# Define o comando para inicializar a aplicação
CMD ["npm", "start"]