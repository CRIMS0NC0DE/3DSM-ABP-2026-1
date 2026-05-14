export class Permission {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  // Permission constants
  static CRIAR_LEAD = "criar_lead";
  static EDITAR_LEAD = "editar_lead";
  static VER_LEAD = "ver_lead";
  static EXCLUIR_LEAD = "excluir_lead";

  static CRIAR_CLIENTE = "criar_cliente";
  static EDITAR_CLIENTE = "editar_cliente";
  static VER_CLIENTE = "ver_cliente";

  static CRIAR_NEGOCIACAO = "criar_negociacao";
  static EDITAR_NEGOCIACAO = "editar_negociacao";
  static VER_NEGOCIACAO = "ver_negociacao";

  static VER_DASHBOARD_OPERACIONAL = "ver_dashboard_operacional";
  static VER_DASHBOARD_ANALITICO = "ver_dashboard_analitico";
  static VER_LOGS = "ver_logs";

  static GERENCIAR_USUARIOS = "gerenciar_usuarios";
  static GERENCIAR_EQUIPES = "gerenciar_equipes";
  static GERENCIAR_TODOS_LEADS = "gerenciar_todos_leads";
}
