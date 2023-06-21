# Node testing with Mocha, Chai, and Puppeteer

This package contains code for a crude front end that makes AJAX calls to the back end.
You can bring up the front end by switching to the directory created by the clone, running localhost:3000 in your browser. 

The AJAX calls do the following:
(1) add an entry to an array of people, where each entry must have a name and an age;
(2) retrieve the array of people
(3) retrieve a specific entry for the array of people. 

To add an entry, the front end sends a post request to the URI /api/v1/people where the body of the request is a json document containing the name (a string), and the age (a number). Both are required, and the age must be non-negative, or a JSON document with an error message is returned with a 400 result code.
If the entry is created, a JSON document with a message saying that "A person entry was added" is returned, along with the index of the
entry just added. To retrieve the array, the front end does a get request to the URI /api/v1/people, and a JSON document containing the array is returned. 
To retrieve a single entry, the front end does a get request to /api/v1/people/:id , where the :id is the index of the entry to be retrieved. A JSON document with the entry is returned, unless the index is out of range, in which case an error message and a 404 result code is returned.

The script command invokes mocha, which is one standard framework for JavaScript tests. The tests themselves are in tests/test.js and tests/puppeteer.js. The tests.js file tests the back end, by sending REST requests to it. The send method specifies the body to be sent (if any), and the end method retrieves the resulting req and res.

For the puppeteer.js tests, you write code to interact with the browser automatically. You can fill out fields and press buttons. You can then check the contents of the HTML document returned. Fields and buttons are specified using CSS selectors. There are a lot of async calls, and a sleep function has been provided so that the test waits a little bit for the page to update.

One tip about mocha test files. Mocha will often complain and throw strange errors if you do not end JavaScript statements with a semicolon.