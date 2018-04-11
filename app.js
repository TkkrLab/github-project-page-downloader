/*
Copyright 2018 Renze Nicolai

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const rp = require('request-promise-native');
const fs = require('fs');

var org = "tkkrlab";

var api_url = "https://api.github.com/orgs/"+org+"/repos"


function saveFile(filename, contents) {
	console.log("saveFile", filename)
	fs.writeFile('projects/'+filename+'.md', contents, (err) => {
		if (err) {
			console.log("Error while saving file:", err);
		} else {
			console.log('The file has been saved!');
		}
	});
}

rp({uri: api_url, json: true, headers: {
        'User-Agent': 'Tkkrlab-projectbot'
    },}).then((repos) => {
	var promises = [];

	for(var repo in repos){
		repo = repos[repo];
		var file_url = "https://raw.githubusercontent.com/"+repo.full_name+"/master/PROJECT.md";
		promises.push(rp({uri: file_url, json: false, timeout: 2000}).then(
			saveFile.bind(null, repo.name)
		).catch((error) => {
		  //console.log("Error:", error);
		}));
	}
	
	Promise.all(promises).then( (values) => {
		console.log("===DONE===");
	});
	
}).catch((error) => {
	console.log("Error: Could not fetch the directory!");
	console.log(error);
});
