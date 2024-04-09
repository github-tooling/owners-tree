const fs = require('fs');

const tsGraph = require('@andriyorehov/ts-graph');

const owners = fs.readFileSync('owners.json', 'utf8');
const ownersObj = JSON.parse(owners);

for (const owner of ownersObj) {
  for (const entries of owner.owns) {
    console.log(entries);
    console.log(Object.keys(tsGraph.getTreeByFile(entries).flatTree));
  }
}
