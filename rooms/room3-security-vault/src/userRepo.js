'use strict';

// Simula um “repositório” com problemas de segurança.
// Não usa DB real para manter o desafio offline.

// SECRET hardcoded (deve ir para env var)
const JWT_SECRET = 'super-secret-not-for-prod';

const _users = [
  { id: '1', username: 'admin', password: 'admin' }, // weak auth
  { id: '2', username: 'bob', password: 'pw' }
];

function login(username, password) {
  // auth fraca: passwords em texto e comparação direta
  const u = _users.find(x => x.username === username && x.password === password);
  if (!u) return { ok: false, error: 'INVALID' };
  // token fraco: previsível
  const token = `${u.id}.${JWT_SECRET}`;
  return { ok: true, token };
}

function findUsersByName(search) {
  // SQL injection simulado: concatenação de query string
  // (aqui só devolve a query para o teste, mas o padrão é o problema)
  const query = "SELECT * FROM users WHERE username LIKE '%" + search + "%';";
  return { query };
}

module.exports = {
  login,
  findUsersByName,
  // leaked
  JWT_SECRET
};
