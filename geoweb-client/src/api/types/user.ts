export type UserDto = {
    id: string;
    username: string;
    email: string;
    name: string;
    phoneNumber: string;
    blocked: boolean;
    roles: RoleDto[];
};

export type RoleDto = {
    id: string;
    code: string;
    name: string;
    description: string;
};

export type UserCreateDto = Omit<UserDto, 'id' | 'blocked'> & {
    password: string;
};

export type UserUpdateDto = Omit<UserDto, 'id' | 'username'>;