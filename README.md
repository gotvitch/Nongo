# [Nongo](https://github.com/Gotvitch/Nongo) [![Build Status](https://travis-ci.org/Gotvitch/Nongo.png?branch=master)](https://travis-ci.org/Gotvitch/Nongo) [![Coverage Status](https://coveralls.io/repos/Gotvitch/Nongo/badge.png?branch=master)](https://coveralls.io/r/Gotvitch/Nongo?branch=master) [![Dependency Status](https://gemnasium.com/Gotvitch/Nongo.png)](https://gemnasium.com/Gotvitch/Nongo)


## Features

Current features:

* List/Create/Delete databases
* List/Create/Delete collections
* Run query on a collection (Find, Sort, Skip, Limit)
* Create/Edit/Delete documents
* List/Create/Delete indexes
* List users

Next features:

* Create/Edit/Delete user
* UI improvement


## Getting Started


### Install

* With [npm](http://github.com/isaacs/npm)

        $ npm install -g nongo

### Configure


```
 $ nongo --help

  Usage: nongo [options]

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    --host [hostname]     MongoDB host
    --port [port]         Mongo DB port
    --config [file]       Config file path
    --webhost [hostname]  Hostname for the website
    --webport [port]      Port for the website

```

Or by configuration file

```
$ nongo --config config.js
```

```js
module.exports = {
    db: {
        hostname: 'locahost',
        port: 27017
    },
    server: {
        hostname: 'localhost',
        port: 8080
    }
};
```

## Screenshot
![Screenshot](http://gotvitch.github.io/Nongo/images/screenshot.png)



## Copyright & License

Released under the MIT License.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
