import * as util from "./util";

const inputPath = "data/day3.txt";
const lines = util.readFileToLines(inputPath);

const claims = lines.map(line => (line.match(/\d+/g) || []).map(Number));
const claimInverseMap = new Map<string, number[]>();
const overlapClaimsSet = new Set<number>();
let result = 0;

for (const claim of claims) {
  const [id, originX, originY, width, height] = claim;
  overlapClaimsSet.add(id);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const key = [originX + x, originY + y].toString();
      const claimList = claimInverseMap.get(key) || [];
      if (claimList.length === 1) {
        result++;
      }
      for (const prevId of claimList) {
        overlapClaimsSet.delete(prevId);
      }
      if (claimList.length > 0) {
        overlapClaimsSet.delete(id);
      }
      claimList.push(id);
      claimInverseMap.set(key, claimList);
    }
  }
}

console.log(result);
console.log(overlapClaimsSet);
