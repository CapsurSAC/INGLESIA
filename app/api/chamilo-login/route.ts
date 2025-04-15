// app/api/chamilo-login/route.ts

import { chamiloDb } from '../../lib/chamiloDb';

import bcrypt from 'bcryptjs'; // Chamilo usa bcrypt

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const [rows]: any = await chamiloDb.query(
    'SELECT * FROM user WHERE username = ? LIMIT 1',
    [username]
  );

  const user = rows[0];

  if (!user) {
    return new Response('Usuario no encontrado', { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return new Response('Contraseña incorrecta', { status: 401 });
  }

  // Aquí podrías devolver un token o guardar en sesión
  return new Response(JSON.stringify({
    id: user.user_id,
    name: `${user.firstname} ${user.lastname}`,
    email: user.email
  }), { status: 200 });
}
