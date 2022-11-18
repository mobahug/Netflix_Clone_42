const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

test('null as login data', async () => {
	const loginUser = null;

	await api
		.post('/api/login')
		.send(loginUser)
		.expect('Required login data missing');
});

test('empty values as login data', async () => {
	const loginUser = {
		username: undefined,
		password: null,
		language: undefined
	};

	await api
		.post('/api/login')
		.send(loginUser)
		.expect('Required login data missing');
});

test('no cookie in get login', async () => {
	await api.get('/api/login').expect('');
});

test('no cookie in post logout', async () => {
	await api.post('/api/logout').expect('');
});
