const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randStr(length) {
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const log = (...args) => {
    args.unshift("==>");
    console.log(...args);
};

let all = [];
let hasEnded = false;

while (!hasEnded) {
    const str = randStr(3);

    if (!all.includes(str)) {
        all.push(str);
        log(str + ' === ' + all.length);
    }
}
