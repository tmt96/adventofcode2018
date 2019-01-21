import "./collection";
import * as util from "./util";

interface Tree {
  metadata: number[];
  children: Tree[];
}

const inputPath = "data/day8.txt";
const input = util
  .readFileToLines(inputPath)[0]!
  .split(" ")
  .map(el => parseInt(el, 10) || 0);

// return tree & length of the slice taken by the tree
function parse(input: number[]): [Tree, number] {
  const [childrenCount, metadataCount] = input.take(2);
  let remaining = input.skip(2);
  const children: Tree[] = [];
  let totalLength = 2 + metadataCount;

  for (let i = 0; i < childrenCount; i++) {
    const [child, length] = parse(remaining);
    remaining = remaining.skip(length);
    totalLength += length;
    children.push(child);
  }

  const metadata = remaining.take(metadataCount);
  const tree: Tree = { metadata, children };
  return [tree, totalLength];
}

function treeSum(tree: Tree): number {
  return (
    tree.metadata.reduce((a, b) => a + b, 0) +
    tree.children.reduce((a, b) => a + treeSum(b), 0)
  );
}

function treeValue(tree: Tree): number {
  let result: number;
  if (tree.children.length === 0) {
    result = tree.metadata.reduce((a, b) => a + b, 0);
  } else {
    result = tree.metadata
      .map(index =>
        tree.children.length > index - 1
          ? treeValue(tree.children[index - 1])
          : 0
      )
      .reduce((a, b) => a + b, 0);
  }
  return result;
}

const [licenseTree, _] = parse(input);
// part 1
console.log(treeSum(licenseTree));
// part 2
console.log(treeValue(licenseTree));
