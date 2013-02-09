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

## Usage

    node server.js

## Run tests

    npm install -g mocha
    mocha

## API

### Download a new file

    POST /download

Parameters:

* url: the url of the sound
* callback: the call-back url called at then end of the download

Status:

* 200: Enqueue
* 400: Bad request

## TODO

* [ ] extract mp3 from youtube video
* [ ] add a private token
