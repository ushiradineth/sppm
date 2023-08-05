import * as yup from "yup";

export const idValidator = yup.string().max(30).required();
export const textValidator = yup.string().min(1).max(500).required();
export const emailValidator = yup.string().email().required();
export const nameValidator = yup.string().min(1).max(100).required();
export const urlValidator = yup.string().url().required();
export const fileValidator = yup.string().required();
export const numberValidator = yup.number().required();
export const pointsValidator = yup.array(yup.string().min(1).max(200).required()).nonNullable().required();
export const periodValidtor = yup.number().min(1).max(365).oneOf([1, 7, 28, 365], "Period has to be either 1, 7, 28, or 365").required();
export const otpValidtor = yup.string().min(1).max(6).required();
export const booleanValidator = yup.boolean().required();

export type Status = "Processing" | "Preparing" | "Prepared" | "OTW" | "Completed" | "Cancelled";
export const status = ["Processing", "Preparing", "Prepared", "OTW", "Completed", "Cancelled"] as Status[];

export const statusValidator = yup
  .string()
  .oneOf(
    ["Preparing", "Prepared", "OTW", "Completed", "Cancelled"],
    "Status has to be either Preparing, Prepared, OTW, Completed or Cancelled",
  )
  .required();

export const passwordValidator = yup
  .string()
  .required()
  .min(8)
  .max(20)
  .matches(/(?=.*[A-Z])/, "Password must have atleast one Uppercase Character")
  .matches(/(?=.*\d)/, "Password must have atleast one Number")
  .matches(/(?=.*[!@#$%^&*])/, "Password must have atleast one Special Character");

export const confirmPasswordValidator = yup
  .string()
  .required("Confirm Password is a required field")
  .test("passwords-match", "Passwords must match", function (value) {
    return this.parent.Password === value;
  });

export const LoginSchema = yup
  .object()
  .shape({
    Password: passwordValidator,
    Email: emailValidator,
  })
  .required();

export type LoginFormData = yup.InferType<typeof LoginSchema>;

export const RegisterSchema = yup
  .object()
  .shape({
    ConfirmPassword: confirmPasswordValidator,
    Password: passwordValidator,
    Email: emailValidator,
    Name: nameValidator,
  })
  .required();

export type RegisterFormData = yup.InferType<typeof RegisterSchema>;

export const ForgetPasswordSchema = yup
  .object()
  .shape({
    Email: emailValidator,
  })
  .required();

export type ForgetPasswordFormData = yup.InferType<typeof ForgetPasswordSchema>;

export const ResetPasswordSchema = yup
  .object()
  .shape({
    OTP: otpValidtor,
    Password: passwordValidator,
  })
  .required();

export type ResetPasswordFormData = yup.InferType<typeof ResetPasswordSchema>;

export const ProductSchema = yup
  .object()
  .shape({
    Images: fileValidator,
    Price: numberValidator,
    Available: booleanValidator,
    Category: idValidator,
    Description: textValidator,
    Name: nameValidator,
  })
  .required();

export type ProductFormData = yup.InferType<typeof ProductSchema>;

export const CategorySchema = yup
  .object()
  .shape({
    Description: textValidator,
    Name: nameValidator,
  })
  .required();

export type CategoryFormData = yup.InferType<typeof CategorySchema>;

export const UserSchema = yup
  .object()
  .shape({
    Image: fileValidator,
    Name: nameValidator,
    Email: emailValidator,
  })
  .required();

export type UserFormData = yup.InferType<typeof UserSchema>;

export const UserEditFormSchema = yup
  .object()
  .shape({
    Image: fileValidator,
    Password: passwordValidator.notRequired(),
    Name: nameValidator,
    Email: emailValidator,
  })
  .required();

export type UserEditFormData = yup.InferType<typeof UserEditFormSchema>;

export const OrderEditSchema = yup
  .object()
  .shape({
    Delivery: booleanValidator,
    Status: textValidator,
    Items: yup
      .array(
        yup.object().shape({
          id: yup.string().max(30),
          quantity: numberValidator,
          product: yup.object().shape({
            id: idValidator,
            name: textValidator,
          }),
        }),
      )
      .required(),
  })
  .required();

export type OrderEditFormData = yup.InferType<typeof OrderEditSchema>;
