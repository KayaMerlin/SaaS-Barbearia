require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const prisma = require('../src/config/db');
const bcrypt = require('bcryptjs');

const EMAIL_ADMIN = process.env.ADMIN_EMAIL;
const NOVA_SENHA = process.env.ADMIN_NOVA_SENHA;

async function main() {
  if (!EMAIL_ADMIN) {
    console.log('Use: ADMIN_EMAIL=seu@email.com node scripts/set-admin.js');
    console.log('Opcional: ADMIN_NOVA_SENHA=novaSenha para trocar a senha.');
    process.exit(1);
  }
  const data = { role: 'ADMIN' };
  if (NOVA_SENHA && NOVA_SENHA.length >= 8) {
    data.senha = await bcrypt.hash(NOVA_SENHA, 10);
  }
  const result = await prisma.user.updateMany({
    where: { email: EMAIL_ADMIN.trim() },
    data
  });
  if (result.count === 0) {
    console.log('Nenhum usuário encontrado com esse e-mail.');
    process.exit(1);
  }
  console.log('OK: usuário definido como ADMIN.');
  if (data.senha) console.log('Senha alterada. Faça login com a nova senha.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
