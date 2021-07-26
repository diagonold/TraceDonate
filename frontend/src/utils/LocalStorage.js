class LocalStorageUtil {
    read(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    create(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    update(key, value) {
        let target = localStorage.getItem(key);

        if (!target) {
            this.localStorageException("Unable to update. The item doesn\'t exist");
        }
        localStorage.setItem(key, JSON.stringify(value));
    }

    remove(key) {
        let target = localStorage.getItem(key);

        if (!target) {
            this.localStorageException("Unable to remove. The item doesn\'t exist");
        }
        localStorage.removeItem(key);
    }

    localStorageException(err) {
        throw new Error(err);
    }
}

export default new LocalStorageUtil();
