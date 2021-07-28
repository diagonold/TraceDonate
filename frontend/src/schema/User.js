import * as yup from 'yup';

export const signInSchema = yup.object().shape({
    username: yup.string().required("username is required"),
    password: yup.string().required("password is required")
});

export const signUpSchema = yup.object().shape({
    username: yup.string().required("username is required"),
    password: yup.string().min(8, "minimum length of password is 8").required("password is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "password not matched").required("must confirm password")
});