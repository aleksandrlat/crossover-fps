var matrix = [
    [1, 0, 1], // 2
    [1, 0, 0], // 1
    [1, 1, 0]  // 2
  // 3  1  1
];

var islandCount = 0;

for (var i = 0; i < matrix.length; i++) {
    var line = matrix[i];

    for (var j = 0; j < line.length; j++) {
        var el = line[j];

        if (el == 1 && left(i, j, matrix) !== 1 && up(i, j, matrix) !== 1) {
            islandCount++;
        }
    }
}

function left(i, j, matrix) {
    if (!matrix[i]) {
        return 0;
    }

    return +matrix[i][j - 1];
}

function up(i, j, matrix) {
    if (!matrix[i - 1]) {
        return 0;
    }
    return +matrix[i - 1][j];
}

console.log(islandCount);