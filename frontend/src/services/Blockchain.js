import AxiosInstance from './AxiosFactory';
import LocalStorageUtil from '../utils/LocalStorage';

export default class Blockchain {
    constructor() {
        this.token = LocalStorageUtil.read("token");
    }

    async getProjects() {
        try {
            const response = await AxiosInstance.get("/api/organizations", {
                headers: {
                    "Authorization": `Bearer ${this.token}`
                }
            });
            return response;
        } catch(err) {
            console.log(err);
        }
    }

    async getTransactions() {
        try {
            const response = await AxiosInstance.get("/api/transactions", {
                headers: {
                    "Authorization": `Bearer ${this.token}`
                }
            });
            return response;
        } catch(err) {
            console.log(err);
        }
    }

    async getWallet() {
        try {
            const response = await AxiosInstance.get("/api/wallets", {
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