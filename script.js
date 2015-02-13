require('shelljs/global');
var path = require('path');

var atticDir = "./_attic";

if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}

var execresult = exec('git show --pretty="oneline" --name-only "HEAD"', {silent: true});
if (execresult.code){
	console.error("Git command didn't execute successfully. Code ", execresult.code);
	console.error(execresult.output);
	exit(1);
}

// First line is commit SHA and commit message. Following lines have file names
var output = execresult.output;
if (output.length == 0){
	callback("No output from git command");
}

var lines = output.split('\n');
if (lines.length < 2){
	callback("Invalid git output: \n" + output);
}

var commitline = lines[0];
var endOfSha = commitline.indexOf(' ');
var sha = commitline.substr(0, endOfSha);
var commitmsg = commitline.substr(endOfSha + 1);
var filenames = lines.splice(1);

var packdir = path.join(atticDir, commitmsg.replace(/[\ \+&]/g, '-'));
var contextdir = path.join(packdir, 'context');
console.log("Storing commit " + commitmsg + " to a packet at " + packdir);

mkdir('-p', packdir);
mkdir('-p', contextdir);
for(var i=0; i < filenames.length; i++){
	var name = filenames[i].trim();
	if (name.length < 1) continue;

	console.log(name);
	var dirname = exec('dirname ' + name).output.trim();
	mkdir('-p', path.join(contextdir, dirname));
	cp(name, path.join(contextdir, name));
}

execresult = exec('git format-patch -n "HEAD^" -o ' + packdir, {silent: true});
if (execresult.code){
	console.error("Git was unable to create patch. Exit code " + execresult.code);
	console.error(execresult.output);
	exit(1);
}

console.log("Commit successfully stored in attic");
