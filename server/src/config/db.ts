import { Pool } from "pg";

class Database {
    private static instance: Database;
    private dbUrl: string | undefined = process.env.DATABASE_URL;
    private pool: Pool | null = null;

    // Construtor privado previne criação de novas instâncias fora da classe
    private constructor() {}

    // Método público para obter a única instância da conexão
    public static getInstance(): Database{
        if(!Database.instance) {
            Database.instance = new Database();
        } 
        return Database.instance
    }

    // Método para iniciar a conexão
    public async connect(): Promise<Pool> {
        if (!this.dbUrl) {
            throw new Error("DATABASE_URL não definido no ambiente.");
        }

        if (!this.pool) {
            this.pool = new Pool({ connectionString: this.dbUrl });
            // Testa a conexão uma vez para falhar rápido se houver problema
            await this.pool.query("SELECT 1");
        }

        return this.pool;
    }
}

export default Database.getInstance();
