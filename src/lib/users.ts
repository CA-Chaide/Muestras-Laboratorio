/**
 * Servicio de Usuarios
 * TODO: Reemplazar funciones con llamadas a API REST
 */
import type { UserProfile } from "./types";
import { users, generateId } from "./data";

export type UserData = {
  name: string;
  email: string;
  role: 'Administrador' | 'Técnico';
}

/**
 * Agrega un nuevo usuario.
 * TODO: Reemplazar con POST /api/users
 */
export async function addUser(userData: UserData): Promise<UserProfile> {
    const newUser: UserProfile = {
        id: generateId(),
        ...userData,
    };
    users.push(newUser);
    return newUser;
}

/**
 * Actualiza un usuario existente.
 * TODO: Reemplazar con PUT /api/users/:userId
 */
export async function updateUser(userId: string, userData: Partial<UserData>): Promise<UserProfile> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('Usuario no encontrado.');
    users[userIndex] = { ...users[userIndex], ...userData };
    return users[userIndex];
}

/**
 * Elimina un usuario.
 * TODO: Reemplazar con DELETE /api/users/:userId
 */
export async function deleteUser(userId: string): Promise<void> {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error('Usuario no encontrado.');
    users.splice(userIndex, 1);
}
