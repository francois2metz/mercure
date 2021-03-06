# Description:
#   Allows Hubot interact with mercure
#
# Configuration:
#   MERCURE_URL - The URL of the mercure instance
#   MERCURE_TOKEN - The private token
#   HUBOT_URL - the URL of the this hubot
#
# Commands:
#   hubot download me <url>
#
# URLS:
#   /mercure/callback/:room - the callback URL when to download is finished

util = require 'util'
url = require 'url'

MERCURE_URL   = process.env.MERCURE_URL
MERCURE_TOKEN = process.env.MERCURE_TOKEN
HUBOT_URL     = process.env.HUBOT_URL

module.exports = (robot) ->
  robot.respond /download me (.*)/i, (msg) ->
    msg.http("#{MERCURE_URL}/download").query({
       token: MERCURE_TOKEN,
       url: msg.match[1],
       callback: "#{HUBOT_URL}/mercure/callback/#{encodeURIComponent(msg.message.room)}"
    }).post() (err, res, body) ->
      return msg.send "error" if err
      return msg.send "Downloading #{msg.match[1]}" if res.statusCode == 202

  robot.router.post "/mercure/callback/:room", (req, res) ->
    robot.messageRoom req.params.room, "File #{req.body.url} (#{req.body.size}): #{req.body.status}"
    res.end "ok"
