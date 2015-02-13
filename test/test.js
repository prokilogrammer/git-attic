// TODO: Must use Mocha when I add more tests

require('shelljs/global');
var path = require('path'),
    expect = require('chai').expect;

var testHomeDir = __dirname;
var testRepoDir = path.join(testHomeDir, "fixtures");
var scriptPath = path.join(testHomeDir, '..', 'script.js');
var atticDirName = "_attic";


// Clean old attic dir if any
if (test('-d', path.join(testRepoDir, atticDirName))){
	rm('-r', path.join(testRepoDir, atticDirName));
}

cd(testRepoDir);
var result = exec("node " + scriptPath, {silent: true})
cd(testHomeDir);

// Script should run to completion
expect(result.code).to.equal(0, result.output);

var testExistence = function(flag, path){
	expect(test(flag, path)).to.be.equal(true, path + " must exist");
}

// Must create the following directory structure under fixtures
var canonicalCommitName = "removing-extremely-useful-lines-coz-I-dont-need-them-now";
testExistence('-d', path.join(testRepoDir, atticDirName))
testExistence('-d', path.join(testRepoDir, atticDirName, canonicalCommitName));
testExistence('-f', path.join(testRepoDir, atticDirName, canonicalCommitName, '0001-removing-extremely-useful-lines-coz-I-dont-need-them.patch'));
testExistence('-f', path.join(testRepoDir, atticDirName, canonicalCommitName, 'context', 'example.txt'));

var exampleInRepo = cat(path.join(testRepoDir,'example.txt'));
var exampleInAttic = cat(path.join(testRepoDir, atticDirName, canonicalCommitName, 'context', 'example.txt'));
expect(exampleInAttic).to.equal(exampleInRepo, "contents of example.txt in attic must be same as the one in repo");

console.log("Test passed!");

// Clean old attic dir if any
rm('-r', path.join(testRepoDir, atticDirName));