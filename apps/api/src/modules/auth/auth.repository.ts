import { query } from "../../lib/db";

interface UserRow {
  id: number;
  email: string;
  full_name: string;
}

interface RoleRow {
  code: string;
}

export async function findUserByEmail(email: string) {
  const userResult = await query<UserRow>(
    `
      SELECT id, email, full_name
      FROM users
      WHERE email = $1
        AND deleted_at IS NULL
        AND is_active = TRUE
      LIMIT 1
    `,
    [email]
  );

  const user = userResult.rows[0];

  if (!user) {
    return null;
  }

  const rolesResult = await query<RoleRow>(
    `
      SELECT r.code
      FROM roles r
      INNER JOIN user_roles ur ON ur.role_id = r.id
      WHERE ur.user_id = $1
      ORDER BY r.code
    `,
    [user.id]
  );

  return {
    id: String(user.id),
    fullName: user.full_name,
    email: user.email,
    roles: rolesResult.rows.map((role) => role.code)
  };
}
