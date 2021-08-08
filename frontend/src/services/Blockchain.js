import AxiosInstance from './AxiosFactory';

export default class Blockchain {
    constructor(token, history) {
        this.token = token;
        this.history = history;
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
            this.history.push("/login");
            this.history.go(0);
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
            this.history.push("/login");
            this.history.go(0);
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
            this.history.push("/login");
            this.history.go(0);
        }
    }
}