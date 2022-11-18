module.exports = (app, pool, bcrypt, upload, fs, path, helperFunctions) => {
	checkProfileData = async (body) => {
		let res;
		if (
			!body.username ||
			!body.firstname ||
			!body.lastname ||
			!body.email ||
			!body.language ||
			!body.infiniteScroll
		)
			return 'Required profile data missing';
		if (helperFunctions.checkValidLanguage(body.language) !== true) {
			return 'Faulty language information';
		}
		if (body.username.length < 4 || body.username.length > 25) {
			res = await helperFunctions.translate(
				'Username has to be between 4 and 25 characters.',
				pool,
				body.language
			);
			return res;
		}
		if (!body.username.match(/^[a-z0-9]+$/i)) {
			res = await helperFunctions.translate(
				'Username should only include characters (a-z or A-Z) and numbers (0-9).',
				pool,
				body.language
			);
			return res;
		}
		if (body.firstname.length > 50 || body.lastname.length > 50) {
			res = await helperFunctions.translate(
				"Come on, your name can't seriously be that long. Maximum for first name and last name is 50 characters.",
				pool,
				body.language
			);
			return res;
		}
		if (
			!body.firstname.match(/^[a-zåäö-]+$/i) ||
			!body.lastname.match(/^[a-zåäö-]+$/i)
		) {
			res = await helperFunctions.translate(
				'First name and last name can only include characters a-z, å, ä, ö and dash (-).',
				pool,
				body.language
			);
			return res;
		}
		if (
			body.email.length > 254 ||
			!body.email.match(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			)
		) {
			res = await helperFunctions.translate(
				'Please enter a valid e-mail address.',
				pool,
				body.language
			);
			return res;
		}

		if (body.infiniteScroll !== 'YES' && body.infiniteScroll !== 'NO') {
			res = await helperFunctions.translate(
				'Faulty infinite scroll information',
				pool,
				body.language
			);
			return res;
		}

		return true;
	};

	app.post('/api/profile/editsettings', async (request, response) => {
		const checkResult = await checkProfileData(request.body);
		if (checkResult !== true) response.send(checkResult);
		else {
			const {
				username,
				firstname,
				lastname,
				email,
				language,
				infiniteScroll,
			} = request.body;
			const cookie = request.cookies.refreshToken;
			if (!cookie) {
				res = await helperFunctions.translate(
					'Refresh token is missing!',
					pool,
					language
				);
				return response.send(res);
			}

			const check = `SELECT * FROM users WHERE token = $1`;
			const user = await pool.query(check, [cookie]);
			if (user.rows.length === 0) {
				res = await helperFunctions.translate(
					'User not signed in!',
					pool,
					language
				);
				return response.send(res);
			}
			let sql =
				'SELECT * FROM users WHERE (username = $1 OR email = $2) AND id != $3';
			const { rows } = await pool.query(sql, [
				username,
				email,
				user.rows[0]['id'],
			]);
			if (rows.length !== 0) {
				res = await helperFunctions.translate(
					'Username or email is already in use!',
					pool,
					language
				);
				return response.send(res);
			}

			try {
				let sql = `UPDATE users
				SET username = $1, firstname = $2, lastname = $3,
				email = $4, language = $5, infinite_scroll = $6
						WHERE id = $7`;
				await pool.query(sql, [
					username,
					firstname,
					lastname,
					email,
					language,
					infiniteScroll,
					user.rows[0]['id'],
				]);
				response.send(true);
			} catch (error) {
				console.log(error);
				res = await helperFunctions.translate(
					'User settings update failed for some reason ¯\\_(ツ)_/¯',
					pool,
					language
				);
				return response.send(res);
			}
		}
	});

	app.post('/api/profile/changepassword', async (request, response) => {
		const cookie = request.cookies.refreshToken;
		const { oldPassword, newPassword, confirmPassword, language } =
			request.body;

		if (!oldPassword || !newPassword || !confirmPassword || !language)
			return response.send('Required password data missing');
		if (helperFunctions.checkValidLanguage(language) !== true) {
			return response.send('Faulty language information');
		}

		if (newPassword !== confirmPassword) {
			res = await helperFunctions.translate(
				'The entered new passwords are not the same!',
				pool,
				language
			);
			return response.send(res);
		} else if (
			!newPassword.match(
				/(?=^.{8,30}$)(?=.*\d)(?=.*[!.@#$%^&*]+)(?=.*[A-Z])(?=.*[a-z]).*$/
			)
		) {
			res = await helperFunctions.translate(
				'PLEASE ENTER A NEW PASSWORD WITH: a length between 8 and 30 characters, at least one lowercase character (a-z), at least one uppercase character (A-Z), at least one numeric character (0-9) and at least one special character',
				pool,
				language
			);
			return response.send(res);
		}

		if (cookie) {
			const sql = 'SELECT * FROM users WHERE token = $1';
			const { rows } = await pool.query(sql, [cookie]);
			if (rows.length === 0) {
				res = await helperFunctions.translate(
					'User not signed in!',
					pool,
					language
				);
				return response.send(res);
			}

			if (!(await bcrypt.compare(oldPassword, rows[0]['password']))) {
				res = await helperFunctions.translate(
					'The old password is not correct!',
					pool,
					language
				);
				return response.send(res);
			} else {
				const hash = await bcrypt.hash(newPassword, 10);
				try {
					var sql1 = 'UPDATE users SET password = $1 WHERE id = $2';
					await pool.query(sql1, [hash, rows[0]['id']]);
					return response.send(true);
				} catch (error) {
					console.log('ERROR :', error);
					res = await helperFunctions.translate(
						'Password creation failed',
						pool,
						language
					);
					return response.send(res);
				}
			}
		}
	});

	app.get('/api/profile/:id', async (request, response) => {
		try {
			let sql = `SELECT * FROM users
				LEFT JOIN user_pictures ON users.id = user_pictures.user_id
				WHERE users.id = $1`;
			const { rows } = await pool.query(sql, [request.params.id]);
			response.send(rows[0]);
		} catch (error) {
			response.send(false);
		}
	});

	app.get('/api/profile', async (request, response) => {
		const cookie = request.cookies.refreshToken;
		if (cookie) {
			try {
				let sql = 'SELECT * FROM users WHERE token = $1';
				const { rows } = await pool.query(sql, [cookie]);
				const { password: removed_password, ...profileData } = rows[0];

				sql = `SELECT * FROM user_pictures WHERE user_id = $1 AND profile_pic = 'YES'`;
				var profile_pic = await pool.query(sql, [rows[0]['id']]);

				if (profile_pic.rows[0]) {
					profileData.profile_pic = profile_pic.rows[0];
				} else {
					profileData.profile_pic = {
						user_id: rows[0]['id'],
						picture_data: null,
					};
				}
				response.send(profileData);
			} catch (error) {
				response.send(false);
			}
		} else {
			response.send(false);
		}
	});

	app.post('/api/profile/setprofilepic/:language', upload.single('file'), async (request, response) => {
			const language = request.params.language;
			if (helperFunctions.checkValidLanguage(language) !== true)
				return response.send('Faulty language information');
			if (request.fileValidationError) {
				res = await helperFunctions.translate(
					'Forbidden filetype!',
					pool,
					language
				);
				return response.send(res);
			}
			if (!request.file)
				return response.send('Required profile pic data missing');
			const cookie = request.cookies.refreshToken;
			const image = `${process.env.REACT_APP_BACKEND_URL}/images/${request.file?.filename}`;
			if (request.file?.size > 5242880) {
				res = await helperFunctions.translate(
					'The maximum size for uploaded images is 5 megabytes.',
					pool,
					language
				);
				return response.send(res);
			}
			if (cookie) {
				try {
					let sql = `SELECT * FROM users WHERE token = $1`;
					let user = await pool.query(sql, [cookie]);
					sql = `SELECT * FROM user_pictures WHERE user_id = $1 AND profile_pic = 'YES'`;
					let { rows } = await pool.query(sql, [user.rows[0]['id']]);

					if (rows.length === 0) {
						sql = `INSERT INTO user_pictures (user_id, picture_data, profile_pic) VALUES ($1, $2, 'YES')`;
						await pool.query(sql, [user.rows[0]['id'], image]);
					} else {
						let oldImageData = rows[0]['picture_data'];
						const oldImage =
							path.resolve(__dirname, '../images') +
							oldImageData.replace(
								`${process.env.REACT_APP_BACKEND_URL}/images`,
								''
							);
						if (fs.existsSync(oldImage)) {
							fs.unlink(oldImage, (err) => {
								if (err) {
									console.error(err);
									return;
								}
							});
						}

						sql = `UPDATE user_pictures SET picture_data = $1 WHERE user_id = $2 AND profile_pic = 'YES'`;
						await pool.query(sql, [image, user.rows[0]['id']]);
						sql = `UPDATE comments SET user_pic = $1 WHERE user_id = $2`;
						await pool.query(sql, [image, user.rows[0]['id']]);
					}
					response.send(true);
				} catch (error) {
					console.log(error);
					res = await helperFunctions.translate(
						'Image uploading failed for some reason.',
						pool,
						language
					);
					return response.send(res);
				}
			} else {
				response.send(false);
			}
		}
	);

	app.delete('/api/profile/deleteuser', async (request, response) => {
		const cookie = request.cookies.refreshToken;
		if (cookie) {
			try {
				const getId = 'SELECT * FROM users WHERE token = $1';
				const { rows } = await pool.query(getId, [cookie]);
				const id = rows[0]['id'];
				var sql = `DELETE FROM users WHERE id = $1`;
				pool.query(sql, [id]);
				response.send(true);
			} catch (error) {
				response.send('Failed to delete user!');
			}
		} else {
			response.send(false);
		}
	});
};
