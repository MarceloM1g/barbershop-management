import jwt from "jsonwebtoken";

export type AuthRole = "CLIENT" | "BARBER";

export type AuthUser = {
    userId: string;
    email: string;
    role: AuthRole;
}

// Função para verificar se o token é válido
export function verifyAuthToken(token?: string): AuthUser | null {
    if (!token) {
        return null;
    }

    function isAuthRole(role: unknown): role is AuthRole {
        return role === "CLIENT" || role === "BARBER";
    }

    try {
        // Importante! Verificar se o token que foi gerado na hora do login, é o mesmo que o token do usuário atualmente
        const payload = jwt.verify(token, process.env.JWT_SECRET!);

        // Verificando se payload não é uma string
        if (typeof payload === "string") {
            return null;
        }

        // Verificando se os campos são algo diferente de string
        if (typeof payload.userId !== "string" || typeof payload.email !== "string" || !isAuthRole(payload.role)) {
            return null;
        }

        // Se tudo estiver certo, retornar as informações do token (AuthUser)
        return {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        }

        // Se tiver algo de errado retornar null, (usuário com token expirado, Não logado ou token adulterado)
    } catch {
        return null;
    }
}