const fs = require("fs");

const parseCSV = (
  path = "./iris.csv",
  columns = 5,
  classMap = { "Iris-setosa": 0, "Iris-versicolor": 1, "Iris-virginica": 2 }
) => {
  const isNumeric = (str) => {
    if (typeof str != "string") return false; // we only process strings!
    return (
      !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ); // ...and ensure strings of whitespace fail
  };
  const data = fs.readFileSync(path, "utf8");
  const splitNewLine = data.split("\n");
  const splitComma = splitNewLine.map((line) => line.split(","));
  const filtered = splitComma.filter((arr) => arr.length === columns);
  const converted = filtered.map((arr) =>
    arr.map((val) => (isNumeric(val) ? parseFloat(val) : classMap[val]))
  );
  return converted;
};

const dataShuffler = (data) => {
  let currentIndex = data.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [data[currentIndex], data[randomIndex]] = [
      data[randomIndex],
      data[currentIndex],
    ];
  }

  return data;
};

const removeLastElement = (arr) => {
  const res = [...arr];
  res.splice(-1);
  return res;
};

const quickSort = (arr, low = 0, high = arr.length - 1) => {
  const swap = (arr, index1, index2) => {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
  };
  const partition = (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      const test = arr[j];
      if (test < pivot) {
        i++;
        swap(arr, i, j);
      }
    }
    swap(arr, i + 1, high);
    return i + 1;
  };
  const sort = (arr, low, high) => {
    if (low < high) {
      const pi = partition(arr, low, high);
      sort(arr, low, pi - 1);
      sort(arr, pi + 1, high);
    }
  };

  sort(arr, low, high);
  return arr;
};

module.exports = {
  removeLastElement,
  quickSort,
  loadData: parseCSV,
  shuffle: dataShuffler,
};
