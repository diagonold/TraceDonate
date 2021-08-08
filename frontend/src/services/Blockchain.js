import AxiosInstance from './AxiosFactory';

export default class Blockchain {
    constructor(token) {
        this.token = token;
    }

    async getProjects() {
        try {
            const response = await AxiosInstance.get("/api/projects", {
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