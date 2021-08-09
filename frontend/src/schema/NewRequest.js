import * as yup from 'yup';

export const newRequestSchema = yup.object().shape({
    project_addy: yup.string().required("Must select the project address"),
    description: yup.string().required("Must set the request description"),
    receiver_addy: yup.string().required("Must select the receiver address"),
    amount: yup.number().required("Must set the request amount")
});