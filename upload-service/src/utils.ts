const MAX_LENGTH = 5

export function generate(){
    const subset = '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let ans = '';
    for (let i = 0; i < MAX_LENGTH; i++) {
        const index = Math.floor(Math.random() * subset.length);
        ans += subset[index];
    }
    return ans;
}