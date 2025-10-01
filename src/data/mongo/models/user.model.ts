import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    emailValidated: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: [String],
        default: ['USER_ROLE'],
        enum: ['USER_ROLE', 'ADMIN_ROLE'],
    }
},
{
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret, options) {
            // Convertir a cualquiera para que podamos eliminar o reasignar propiedades de forma segura sin errores de TS
            const r = ret as any;
            // Proporcione un campo de identificación más amigable y elimine _id
            if (r && r._id) {
                r.id = r._id;
                delete r._id; // Aceptar después de enviar a cualquier
            }
            return r;
        },
    },
    toObject: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret, options) {
            // Convertir a cualquiera para que podamos eliminar o reasignar propiedades de forma segura sin errores de TS
            const r = ret as any;
            // Proporcione un campo de identificación más amigable y elimine _id
            if (r && r._id) {
                r.id = r._id;
                delete r._id; // Aceptar después de enviar a cualquier
            }
            return r;
        },
    },
})

export const UserModel = mongoose.model('User', userSchema);