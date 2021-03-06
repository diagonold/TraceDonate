import * as yup from 'yup';

export const newProjectSchema = yup.object().shape({
    project_name: yup.string().required("Must set a name for the project"),
    description: yup.string().required("Must set a description for the project"),
    min_donation_amount: yup.number().required("Must set minimum donation amount"),
    goal: yup.number().required("Must set donation goal")
});