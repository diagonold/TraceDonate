import AxiosInstance from './AxiosFactory';
import LocalStorageUtil from '../utils/LocalStorage';

export default class Blockchain {
    constructor() {
        this.token = LocalStorageUtil.read("token");
    }

    async getOrganizations() {
        try {
            const response = await AxiosInstance.get("/organizations", {
                headers: {
                    "Authorization": `Bearer ${this.token}`
                }
            });
            return response;
        } catch(err) {
            console.log(err);
        }
    }
}