function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array
}

const deck = shuffle([])

function createDeck() {
    return shuffle([
    '1c',
    '1d',
    '1h',
    '1s',
    '2c',
    '2d',
    '2h',
    '2s',
    '3c',
    '3d',
    '3h',
    '3s',
    '4c',
    '4d',
    '4h',
    '4s',
    '5c',
    '5d',
    '5h',
    '5s',
    '6c',
    '6d',
    '6h',
    '6s',
    '7c',
    '7d',
    '7h',
    '7s',
    '8c',
    '8d',
    '8h',
    '8s',
    '9c',
    '9d',
    '9h',
    '9s',
    '10c',
    '10d',
    '10h',
    '10s',
    'jc',
    'jd',
    'jh',
    'js',
    'qc',
    'qd',
    'qh',
    'qs',
    'kc',
    'kd',
    'kh',
    'ks'
    ])
}

module.exports.createDeck = createDeck