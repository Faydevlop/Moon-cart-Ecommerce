function findDuplicates(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) {
                console.log('Duplicate found:', arr[i]);
            }
        }
    }
}

const myArray = [1, 2, 3, 4, 2, 5, 6, 3, 7, 8, 9, 1];
findDuplicates(myArray);