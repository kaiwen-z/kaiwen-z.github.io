export const fold = (reducer, init, xs) => {
    let acc = init;
    for (const x of xs) {
        acc = reducer(acc, x);
    }
    return acc;
};

// I love CSCC24
// https://dev.to/mebble/learn-to-fold-your-js-arrays-2o8p
export const or = xs => fold((acc, x) => acc | x, 0, xs);
export const and = xs => fold((acc, x) => acc & x, 1, xs);
export const xor = xs => fold((acc, x) => acc ^ x, null, xs);

export function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
  
export function pDistance(x, y, x1, y1, x2, y2) {

    let a = x - x1;
    let b = y - y1;
    let c = x2 - x1;
    let d = y2 - y1;

    let dot = a * c + b * d;
    let len_sq = c * c + d * d;
    let param = -1;
    if (len_sq != 0)
        param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * c;
        yy = y1 + param * d;
    }

    let dx = x - xx;
    let dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}
