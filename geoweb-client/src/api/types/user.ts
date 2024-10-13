import { RoleDto } from "./role";

export type UserDto = {
    id: string;
    username: string;
    email: string;
    name: string;
    phoneNumber: string;
    blocked: boolean;
    roles: RoleDto[];
};

export type UserCreateDto = Omit<UserDto, 'id' | 'blocked'> & {
    password: string;
};

export type UserUpdateDto = Omit<UserDto, 'id' | 'username'>;