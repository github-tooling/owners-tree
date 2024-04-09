const fs = require('fs');
const { execSync } = require('child_process')

const tsGraph = require('@andriyorehov/ts-graph');


module.exports = async ({ github, context }) => {
  const { commits } = context.payload.pull_request

  const rawFiles = execSync(`git diff --name-only HEAD HEAD~${commits}`).toString()
  const changedFiles = rawFiles.split('\n').filter(Boolean)

  const owners = fs.readFileSync('owners.json', 'utf8');
  const ownersObj = JSON.parse(owners);

  for (const owner of ownersObj) {
    for (const entries of owner.owns) {
      const paths = Object.keys(tsGraph.getTreeByFile(entries).flatTree);
      if (changedFiles.some(file => paths.includes(file))) {
        execSync(`gh pr edit ${process.env.PR_NUMBER} --add-reviewer ${owner.team}`)
      }
    }
  }
};
