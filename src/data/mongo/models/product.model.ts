import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
    },
    available: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
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
  }
);

// productSchema.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret, options) {
//     // Convertir a cualquiera para que podamos eliminar o reasignar propiedades de forma segura sin errores de TS
//     const r = ret as any;
//     // Proporcione un campo de identificación más amigable y elimine _id
//     if (r && r._id) {
//       r.id = r._id;
//       delete r._id; // Aceptar después de enviar a cualquier
//     }
//     return r;
//   },
// });

// productSchema.set("toObject", {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret, options) {
//     // Convertir a cualquiera para que podamos eliminar o reasignar propiedades de forma segura sin errores de TS
//     const r = ret as any;
//     // Proporcione un campo de identificación más amigable y elimine _id
//     if (r && r._id) {
//       r.id = r._id;
//       delete r._id; // Aceptar después de enviar a cualquier
//     }
//     return r;
//   },
// });

export const ProductModel = mongoose.model("Product", productSchema);
