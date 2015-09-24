/* eslint-env browser */

"use strict";

module.exports = function(core, config, store) {
	var React = require("react"),
		ConnectionStatus;

	ConnectionStatus = React.createClass({
		render: function() {
			const { connection } = this.state;

			let text;

			if (connection === "offline") {
				text = "You're offline!";
			} else if (connection === "connecting") {
				text = "Connecting...";
			} else {
				text = "";
			}

			return (
			        <div className="connection-status" data-state="offline connecting">
			        	<div>{text}</div>
			        	{connection === "offline" ? <button onClick={() => window.location.reload(true)}>Retry</button> : null}
			        </div>
			);
		},

		getInitialState: function() {
			return { connection: null };
		},

		onStateChange: function(changes) {
			if (changes.app && "connectionStatus" in changes.app) {
				this.setState({ connection: store.get("app", "connectionStatus") });
			}
		},

		componentDidMount: function() {
			core.on("statechange", this.onStateChange, 500);
		},

		componentWillUnmount: function() {
			core.off("statechange", this.onStateChange);
		}
	});

	return ConnectionStatus;
};

