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

    async vote(payload) {
        try {
            const response = await AxiosInstance.post("/api/vote", payload, {
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

    async donate(payload) {
        try {
            const response = await AxiosInstance.post("/api/donate", payload, {
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

    async createNewProject(payload) {
        try {
            const response = await AxiosInstance.post("/api/create_project", payload, {
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

    async createNewRequest(payload) {
        try {
            const response = await AxiosInstance.post("/api/create_request", payload, {
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