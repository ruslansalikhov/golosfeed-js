Golos Feed JS
============

This is a GOLOS Price Feed for witnesses on the [Golos Network](https://golos.io). It's
written in Node.JS and uses Someguy123's (fork of SVK's) [GolosJS-Lib](https://github.com/someguy123/golosjs-lib).

Installation
========

First, download the git repository, then edit `config.json` as needed. The interval is in minutes.

```
git clone https://github.com/Someguy123/golosfeed-js.git
cd golosfeed-js
cp config.example.json config.json
nano config.json
```

I recommend using Docker, however you can also use a locally installed copy of Node v6.

**Starting Via Docker**

```
docker build -t golosfeed-js .
docker run -it --rm --name feed golosfeed-js

# Check the status with docker logs
docker logs feed
```

**Starting Via NodeJS (assuming you have v6 installed)**
```
npm install
npm start
```
