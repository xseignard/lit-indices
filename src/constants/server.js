export default {
	SERVER_HOST: process.env.NODE_ENV === 'development'
		? 'http://localhost'
		: 'http://192.168.0.116',
	SERVER_PORT: process.env.NODE_ENV === 'development' ? 3030 : 3000,
};
