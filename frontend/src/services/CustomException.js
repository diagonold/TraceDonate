export const signOutUserOnException = (err, history) => {
    console.log(err);
    history.push("/login");
    history.go(0);
}