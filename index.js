/*

    index.js - The main server file. Holds all the important backend functions.
    Copyright (C) 2022  ゲス GESU

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

const express = require("express");
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const EventSource = require("eventsource");
const axios = require("axios");
const moment = require("moment");
const {
  dev_mode,
  bot_token,
  api_base,
  mount,
  station_name,
  guild,
  stage_channel,
  lavalink_nodes,
} = require("./config.json");
const { Shoukaku, Connectors } = require("shoukaku");
const Filter = require("bad-words");

const app = express();
const client = new Client({
  presence: {
    status: "idle",
    activities: [{ name: "gesugao.net", type: ActivityType.Listening }],
  },
  intents: [GatewayIntentBits.GuildVoiceStates],
});
const shoukaku = new Shoukaku(new Connectors.DiscordJS(client), lavalink_nodes);
const filter = new Filter({ placeHolder: "◼", replaceRegex: /[aeiou]/g });

let np_data = {
  title: "",
  artist: "",
  text: "",
  start: moment().toISOString(),
  end: moment().toISOString(),
};
let art = Buffer.from([], "binary");
let stageInstace;

app.get("/api/now_playing", (_, res) => {
  res.json(np_data);
});

app.get("/api/now_playing/art", (_, res) => {
  res.contentType("image/jpeg");
  res.send(art);
});

client.once("ready", async () => {
  channel = await client.channels.fetch(stage_channel);

  console.log("Client Online");
});

shoukaku.on("ready", async () => {
  if (dev_mode) return;

  channel = await client.channels.fetch(stage_channel);
  let Guild = await client.guilds.fetch(guild);

  stageInstace =
    (await Guild.stageInstances.fetch(stage_channel).catch(() => {})) ||
    (await Guild.stageInstances.create(stage_channel, {
      topic: np_data.text ? filter.clean(np_data.text) : "GESU 24/7",
      privacyLevel: 1,
      sendStartNotification: false,
    }));

  const node = shoukaku.getNode();
  if (!node) return;
  const result = await node.rest.resolve(mount);
  if (!result?.tracks.length) return;
  const metadata = result.tracks.shift();
  const player = await node.joinChannel({
    guildId: guild,
    channelId: stage_channel,
    shardId: 0,
  });
  Guild.members.me.voice.setSuppressed(false);
  player.playTrack({ track: metadata.track }).setVolume(0.5);
  player
    .on("end", () => {
      player.playTrack({ track: metadata.track });
    })
    .on("stuck", () => {
      player.playTrack({ track: metadata.track });
    });
});

shoukaku.on("error", (_, error) => console.error(error));

client.login(bot_token);

const sseUri = `${api_base}/live/nowplaying/sse?cf_connect={"subs":{"station:${station_name}":{}}}`;

let sse = new EventSource(sseUri);

sse.onmessage = (e) => {
  try {
    const data = JSON.parse(e.data);

    const np = data?.pub?.data?.np || null;
    if (np && np_data.text != np.now_playing.song.text) {
      np_data = {
        title: np.now_playing.song.title,
        artist: np.now_playing.song.artist,
        text: np.now_playing.song.text,
        start: moment(np.now_playing.played_at, "X").toISOString(),
        end: moment(
          np.now_playing.played_at + np.now_playing.duration,
          "X"
        ).toISOString(),
      };

      console.log(`Now Playing >>> ${np_data.text}`);

      axios
        .get(np.now_playing.song.art, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          art = Buffer.from(response.data, "binary");
        });

      client.user.setActivity(np.now_playing.song.text, {
        type: ActivityType.Listening,
      });

      if (stageInstace)
        stageInstace
          .setTopic(filter.clean(np.now_playing.song.text))
          .catch(() => {});
    }
  } catch {}
};

app.listen(process.env.PORT || 8000, () => {
  console.log("Server Online");
});
