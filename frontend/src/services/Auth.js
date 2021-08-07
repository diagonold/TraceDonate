import AxiosInstance from './AxiosFactory';
import LocalStorageUtil from '../utils/LocalStorage';

export default class Auth {
    constructor() {
        this.token = LocalStorageUtil.read("token");
    }

    async login(payload) {
        try {
            const response = await AxiosInstance.post("/api/login/", payload);
            return response;
        } catch(err) {
            console.log(err);
        }
    }

    async register(payload) {
        try {
            const response = await AxiosInstance.post("/api/register/", payload, {
                headers: {
                    "Authorization": `Bearer ${this.token}`
                }
            });
            return response;
        } catch(err) {
            console.log(err);
        }
    }

    async logout() {
        try {
            LocalStorageUtil.remove("token");
            LocalStorageUtil.remove("TraceDonateUsername");
            return true;
        } catch(err) {
            return false;
        }
    }
}