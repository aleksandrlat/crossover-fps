export default function async(gen) {
    gen = gen.next ? gen : gen();

    function catc(err) {
        gen.throw(err);
    }

    (function go(res) {
        if (res instanceof Array && res.some(i => i instanceof Promise)) {
            Promise.all(res).then(go, catc);
        } else if (res instanceof Promise) {
            res.then(go, catc);
        } else {
            let item = gen.next(res);
            if (!item.done) {
                go(item.value);
            }
        }
    })();
}