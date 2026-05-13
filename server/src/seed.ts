import bcrypt from "bcryptjs";
import { Permission } from "./domain/entities/Permission";
import { Role } from "./domain/entities/Role";
import prisma from "./config/db";

const rolePermissions: Record<string, string[]> = {
  [Role.ATENDENTE]: [
    Permission.CRIAR_LEAD,
    Permission.EDITAR_LEAD,
    Permission.VER_LEAD,
    Permission.CRIAR_CLIENTE,
    Permission.EDITAR_CLIENTE,
    Permission.VER_CLIENTE,
    Permission.CRIAR_NEGOCIACAO,
    Permission.EDITAR_NEGOCIACAO,
    Permission.VER_NEGOCIACAO,
    Permission.VER_DASHBOARD_OPERACIONAL,
  ],
  [Role.GERENTE]: [
    Permission.EDITAR_LEAD,
    Permission.VER_LEAD,
    Permission.VER_CLIENTE,
    Permission.VER_NEGOCIACAO,
    Permission.VER_DASHBOARD_OPERACIONAL,
    Permission.VER_DASHBOARD_ANALITICO,
  ],
  [Role.GERENTE_GERAL]: [
    Permission.VER_LEAD,
    Permission.VER_CLIENTE,
    Permission.VER_NEGOCIACAO,
    Permission.VER_DASHBOARD_OPERACIONAL,
    Permission.VER_DASHBOARD_ANALITICO,
  ],
  [Role.ADMIN]: [
    Permission.CRIAR_LEAD,
    Permission.EDITAR_LEAD,
    Permission.VER_LEAD,
    Permission.EXCLUIR_LEAD,
    Permission.CRIAR_CLIENTE,
    Permission.EDITAR_CLIENTE,
    Permission.VER_CLIENTE,
    Permission.CRIAR_NEGOCIACAO,
    Permission.EDITAR_NEGOCIACAO,
    Permission.VER_NEGOCIACAO,
    Permission.VER_DASHBOARD_OPERACIONAL,
    Permission.VER_DASHBOARD_ANALITICO,
    Permission.VER_LOGS,
    Permission.GERENCIAR_USUARIOS,
    Permission.GERENCIAR_EQUIPES,
    Permission.GERENCIAR_TODOS_LEADS,
  ],
};

async function upsertRole(name: string, description: string) {
  return prisma.role.upsert({
    where: { name },
    update: { description },
    create: { name, description },
  });
}

async function upsertPermission(name: string) {
  return prisma.permission.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function seedDatabase() {
  const roles = await Promise.all([
    upsertRole(Role.ATENDENTE, "Atendente - acessa apenas seus proprios leads"),
    upsertRole(Role.GERENTE, "Gerente - acessa atendentes e leads da sua equipe"),
    upsertRole(Role.GERENTE_GERAL, "Gerente Geral - acessa dados consolidados de todas as equipes"),
    upsertRole(Role.ADMIN, "Administrador - acesso total ao sistema"),
  ]);

  const permissions = await Promise.all(
    [...new Set(Object.values(rolePermissions).flat())].map((permission) => upsertPermission(permission)),
  );

  const permissionByName = new Map(permissions.map((permission) => [permission.name, permission.id]));

  for (const role of roles) {
    const permissionNames = rolePermissions[role.name] ?? [];
    await prisma.role.update({
      where: { id: role.id },
      data: {
        permissions: {
          set: permissionNames.map((permissionName) => {
            const permissionId = permissionByName.get(permissionName);
            if (!permissionId) {
              throw new Error(`Permissao ${permissionName} nao encontrada.`);
            }
            return { id: permissionId };
          }),
        },
      },
    });
  }

  const adminRole = roles.find((role) => role.name === Role.ADMIN);
  const generalManagerRole = roles.find((role) => role.name === Role.GERENTE_GERAL);

  if (!adminRole || !generalManagerRole) {
    throw new Error("Roles obrigatorios nao foram criados.");
  }

  await prisma.user.upsert({
    where: { email: "admin@sistema.com" },
    update: { roleId: adminRole.id },
    create: {
      name: "Administrador",
      email: "admin@sistema.com",
      password: await bcrypt.hash("Admin@2026", 10),
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "gerente.geral@sistema.com" },
    update: { roleId: generalManagerRole.id },
    create: {
      name: "Gerente Geral",
      email: "gerente.geral@sistema.com",
      password: await bcrypt.hash("GerenteGeral@2026", 10),
      roleId: generalManagerRole.id,
    },
  });
}

seedDatabase()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed RBAC concluido.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
