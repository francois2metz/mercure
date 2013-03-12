# Mercure

Mercure main job is to download files, store it on disk, and call you back on finish.

We use it at Stormz to download sounds from the internet to our internal mpd install.
We ask Hubot to download a new file, it forward the request to mercure, which download it and call back hubot which update mpd database.

It exposes a REST API.

## Install

    git clone git://github.com/francois2metz/mercure.git
    cd mercure
    npm install

## Configuration

* TODO: configure the data dir
* TODO: configure the token

## Usage

    node server.js

## Run tests

    npm install -g mocha
    mocha

## API

### Download a new file

    POST /download

Parameters:

* url: (required) the url of the sound
* token: (required) the token which protect the API
* callback: (optional) the call-back url called at then end of the download

Status:

* 200: Enqueue
* 400: Bad request

## Hubot

Add to your *external_scripts.json*: "mercure".

### Configuration

* MERCURE_URL - the url where mercure is available
* MERCURE_TOKEN - the private token to talk with mercure (shutt, this is a secret)
* HUBOT_URL - the current url of the hubot (needed for the webhook)

### Commands

    hubot download me file

## TODO

* [ ] extract mp3 from youtube video

## License

This software is licensed under the MIT License.

Copyright (c) 2013 François de Metz

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
