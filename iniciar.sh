
#!/bin/sh
set -e

echo "Aguardando e preparando o banco de dados..."

npx prisma migrate deploy

echo "Executando a carga inicial..."

npm run seed

echo "Iniciando a API..."

exec npm start
