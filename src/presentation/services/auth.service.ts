import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { UserModel } from "../../data/";
import { bcryptAdapter, JwtAdapter } from "../../config";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

export class AuthService {

    //DI - Inject Dependencies
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const { email } = registerUserDto;
        const existUser = await UserModel.findOne({ email });
        if (existUser) throw CustomError.badRequest('Email already exists');
        try {
            const user = await UserModel.create(registerUserDto);

            // Encrypt password
            user.password = await bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            // JWT <-------- Para mantener la autenticación del usuario

            // Email de confirmación

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: '123456',
            };
        } catch (error) {
            throw CustomError.internalServer(`Error registering user: ${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const user = await UserModel.findOne({ email });
        if (!user) throw CustomError.badRequest('Email no exist');
        const isPasswordValid = await bcryptAdapter.compare(password, user.password);
        if (!isPasswordValid) throw CustomError.badRequest('Email or password not valid');
        const { password: _, ...userEntity } = UserEntity.fromObject(user);
        const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
        if (!token) throw CustomError.internalServer('Error generating token');
        return {
            user: userEntity,
            token,
        };
    }
}
