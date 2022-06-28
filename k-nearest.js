const { removeLastElement, quickSort, loadData, shuffle } = require("./utils");

const euclideanDistance = (v1, v2) =>
  Math.sqrt(v1.reduce((acc, v, index) => acc + (v - v2[index]) ** 2, 0));

const getNeighbors = (rows, testRow) =>
  rows.reduce((acc, row, index) => {
    const distance = euclideanDistance(
      removeLastElement(row),
      removeLastElement(testRow)
    );
    return { ...acc, [distance]: index };
  }, {});

const kNearest = (data, target, k) => {
  const neighbors = getNeighbors(data, target);
  const sorted = quickSort(Object.keys(neighbors));
  return sorted
    .map((distance) => {
      const index = neighbors[distance];
      return data[index];
    })
    .slice(0, k);
};

const predict = (nearest, classIndex) => {
  let predVal = 0;
  let pred;
  const classMapping = nearest.reduce((acc, row) => {
    const classification = row[classIndex];
    if (classification in acc) {
      acc[classification]++;
    } else {
      acc[classification] = 1;
    }
    return acc;
  }, {});
  Object.entries(classMapping).forEach(([classification, val]) => {
    if (val > predVal) {
      predVal = val;
      pred = classification;
    }
  });
  return parseInt(pred);
};

const evaluate = () => {
  const dataset = shuffle(loadData());
  const middleIndex = dataset.length / 2;
  const trainDataSet = dataset.slice(0, middleIndex);
  const testDataSet = dataset.slice(middleIndex, dataset.length);
  let correct = 0;
  testDataSet.forEach((row) => {
    const fiveNearest = kNearest(trainDataSet, row, 5);
    const prediction = predict(fiveNearest, 4);
    if (prediction === row[4]) {
      correct++;
    }
  });
  console.log((correct / testDataSet.length) * 100);
};
evaluate();

const test = () => {
  const testDataSet = [
    [2.7810836, 2.550537003, 0],
    [1.465489372, 2.362125076, 0],
    [3.396561688, 4.400293529, 0],
    [1.38807019, 1.850220317, 0],
    [3.06407232, 3.005305973, 0],
    [7.627531214, 2.759262235, 1],
    [5.332441248, 2.088626775, 1],
    [6.922596716, 1.77106367, 1],
    [8.675418651, -0.242068655, 1],
    [7.673756466, 3.508563011, 1],
  ];
  const row0 = testDataSet[0];
  const threeNearest = kNearest(testDataSet, row0, 3);
  const prediction = predict(threeNearest, 2);
  console.log(prediction);
};
