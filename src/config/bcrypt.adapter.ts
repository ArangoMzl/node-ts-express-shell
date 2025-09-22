import bcrypt from 'bcryptjs';

export const bcryptAdapter = {
    hash: async (password: string) => {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hashSync(password, salt);
    },
    compare: async (password: string, hashedPassword: string) => {
        return bcrypt.compareSync(password, hashedPassword);
    }
}