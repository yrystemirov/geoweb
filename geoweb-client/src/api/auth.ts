import instance from "../utils/axios/intance"

const getToken = (username: string, password: string) => {
    return instance.post('/auth/token', {
        username,
        password
    })
}

export const authAPI = {
    getToken
}