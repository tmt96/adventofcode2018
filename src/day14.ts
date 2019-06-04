function getNextRecipes(
  portionList: number[],
  first: number,
  second: number
): number[] {
  const sum = portionList[first] + portionList[second];
  return sum < 10 ? [sum] : [Math.floor(sum / 10), sum % 10];
}

function part1(recipes: number): string {
  let portionList = [3, 7];
  let firstIndex = 0;
  let secondIndex = 1;
  while (portionList.length < recipes + 10) {
    portionList.push(...getNextRecipes(portionList, firstIndex, secondIndex));
    firstIndex =
      (firstIndex + portionList[firstIndex] + 1) % portionList.length;
    secondIndex =
      (secondIndex + portionList[secondIndex] + 1) % portionList.length;
  }
  return portionList.slice(recipes, recipes + 10).join("");
}

function part2(recipes: number): number {
  let portionList = [3, 7];
  let firstIndex = 0;
  let secondIndex = 1;
  const recipeStr = recipes + "";

  while (true) {
    portionList.push(...getNextRecipes(portionList, firstIndex, secondIndex));

    if (
      portionList.slice(portionList.length - recipeStr.length).join("") ===
      recipeStr
    ) {
      return portionList.length - recipeStr.length;
    } else if (
      portionList
        .slice(
          portionList.length - recipeStr.length - 1,
          portionList.length - 1
        )
        .join("") === recipeStr
    ) {
      return portionList.length - recipeStr.length - 1;
    }

    firstIndex =
      (firstIndex + portionList[firstIndex] + 1) % portionList.length;
    secondIndex =
      (secondIndex + portionList[secondIndex] + 1) % portionList.length;
  }
}

console.log(part1(864801));
console.log(part2(864801));
