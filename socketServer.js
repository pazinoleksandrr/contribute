var users = {};

module.exports = (server, options) => {
	const io = require('socket.io')(server, options);

	io.on('connection', (socket) => {
		socket.on('CONNECT', (account_id) => {
            users = { ...users, [ socket.id ]: account_id };
		});

		socket.on('disconnect', () => {
			delete users[socket.id];
		});
	});

	return io;
}