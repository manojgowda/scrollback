"use strict";

var roomUtils = require("./room-utils.js");

module.exports = function(state, compact) {
	var mode = state.nav.mode,
		room = state.nav.room,
		threadId, threadObj, title;

	switch (mode) {
	case "room":
		title = roomUtils.getName(room) + (compact ? "" : " on Scrollback");
		break;
	case "chat":
		threadId = state.nav.thread;

		if (state.indexes && state.indexes.threadsById && state.indexes.threadsById[threadId]) {
			threadObj = state.indexes.threadsById[threadId];
		}

		if (threadId) {
			title = threadObj && threadObj.title ? threadObj.title + (compact ? "" : " - " + roomUtils.getName(room)) : roomUtils.getName(room);
		} else {
			title = "All messages" + (compact ? "" : " - " + roomUtils.getName(room));
		}

		break;
	default:
		title = "Scrollback";
	}

	return title;
};
