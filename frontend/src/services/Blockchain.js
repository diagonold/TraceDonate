import AxiosInstance from './AxiosFactory';
import {
    signOutUserOnException
} from './CustomException';

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
            signOutUserOnException(err, this.history);
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
            signOutUserOnException(err, this.history);
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
            signOutUserOnException(err, this.history);
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
            signOutUserOnException(err, this.history);
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
            signOutUserOnException(err, this.history);
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
            signOutUserOnException(err, this.history);
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
            signOutUserOnException(err, this.history);
        }        
    }
}