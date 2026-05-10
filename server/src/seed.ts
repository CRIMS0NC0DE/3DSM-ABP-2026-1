import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { Role } from "./domain/entities/Role";
import { Permission } from "./domain/entities/Permission";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // ============ Criar Roles ============
    console.log("📝 Criando roles...");

    const roles = [
      { name: Role.ATENDENTE, description: "Atendente - Gerencia apenas seus leads" },
      { name: Role.GERENTE, description: "Gerente - Supervisiona uma equipe" },
      {
        name: Role.GERENTE_GERAL,
        description: "Gerente Geral - Visualiza todas as equipes",
      },
      { name: Role.ADMIN, description: "Administrador - Acesso total" },
    ];

    const createdRoles: any = {};

    for (const role of roles) {
      const existingRole = await prisma.role.findUnique({
        where: { name: role.name },
      });

      if (!existingRole) {
        const createdRole = await prisma.role.create({
          data: role,
        });
        createdRoles[role.name] = createdRole;
        console.log(`✅ Role ${role.name} criado`);
      } else {
        createdRoles[role.name] = existingRole;
        console.log(`⏭️  Role ${role.name} já existe`);
      }
    }

    // ============ Criar Permissions ============
    console.log("\n📝 Criando permissões...");

    const permissions = [
      { name: Permission.CRIAR_LEAD },
      { name: Permission.EDITAR_LEAD },
      { name: Permission.VER_LEAD },
      { name: Permission.EXCLUIR_LEAD },
      { name: Permission.CRIAR_CLIENTE },
      { name: Permission.EDITAR_CLIENTE },
      { name: Permission.VER_CLIENTE },
      { name: Permission.CRIAR_NEGOCIACAO },
      { name: Permission.EDITAR_NEGOCIACAO },
      { name: Permission.VER_NEGOCIACAO },
      { name: Permission.VER_DASHBOARD_OPERACIONAL },
      { name: Permission.VER_DASHBOARD_ANALITICO },
      { name: Permission.VER_LOGS },
      { name: Permission.GERENCIAR_USUARIOS },
      { name: Permission.GERENCIAR_EQUIPES },
      { name: Permission.GERENCIAR_TODOS_LEADS },
    ];

    const createdPermissions: any = {};

    for (const permission of permissions) {
      const existingPermission = await prisma.permission.findUnique({
        where: { name: permission.name },
      });

      if (!existingPermission) {
        const createdPermission = await prisma.permission.create({
          data: permission,
        });
        createdPermissions[permission.name] = createdPermission;
        console.log(`✅ Permission ${permission.name} criada`);
      } else {
        createdPermissions[permission.name] = existingPermission;
        console.log(`⏭️  Permission ${permission.name} já existe`);
      }
    }

    // ============ Criar Usuário Admin ============
    console.log("\n👤 Criando usuário admin...");

    const adminEmail = "admin@sistema.com";
    const adminPassword = "Admin@2026";

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          roleId: createdRoles[Role.ADMIN].id,
          teamId: null,
        },
      });

      console.log(`✅ Usuário admin criado`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Senha: ${adminPassword}`);
      console.log(`   ID: ${adminUser.id}`);
    } else {
      console.log(`⏭️  Usuário admin já existe`);
    }

    // ============ Criar Usuário Gerente Geral ============
    console.log("\n👤 Criando usuário gerente geral...");

    const gerentGeralEmail = "gerente.geral@sistema.com";
    const gerenteGeralPassword = "GerenteGeral@2026";

    const existingGerenteGeral = await prisma.user.findUnique({
      where: { email: gerentGeralEmail },
    });

    if (!existingGerenteGeral) {
      const hashedPassword = await bcrypt.hash(gerenteGeralPassword, 10);

      const gerenteGeralUser = await prisma.user.create({
        data: {
          email: gerentGeralEmail,
          password: hashedPassword,
          roleId: createdRoles[Role.GERENTE_GERAL].id,
          teamId: null,
        },
      });

      console.log(`✅ Usuário gerente geral criado`);
      console.log(`   Email: ${gerentGeralEmail}`);
      console.log(`   Senha: ${gerenteGeralPassword}`);
      console.log(`   ID: ${gerenteGeralUser.id}`);
    } else {
      console.log(`⏭️  Usuário gerente geral já existe`);
    }

    console.log("\n✨ Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase().catch((error) => {
  console.error(error);
  process.exit(1);
});
