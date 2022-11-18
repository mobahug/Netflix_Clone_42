import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeNotification } from '../reducers/notificationReducer';
import { changeSeverity } from '../reducers/severityReducer';
import signUpService from '../services/signUpService';
import Notification from './Notification';
import { Button, Paper, TextField, Typography, Box } from '@mui/material';
import { Container } from '@mui/system';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: '#fcba03',
		},
		secondary: {
			main: '#F5F5F5',
		},
	},
});

const Signup = ({ t }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const user = useSelector((state) => state.user);
	const language = useSelector((state) => state.language);
	const [pictureForm, setPictureForm] = useState(null);

	useEffect(() => {
		if (user !== undefined && user !== '') {
			navigate('/profile');
		}
	}, [user, navigate]);

	const submitUser = async (event) => {
		event.preventDefault();

		const signedUpUser = {
			username: event.target.username.value,
			firstname: event.target.firstname.value,
			lastname: event.target.lastname.value,
			email: event.target.email.value,
			password: event.target.password.value,
			confirmPassword: event.target.confirm_password.value,
			language: language
		};

		signUpService
			.createUser(signedUpUser)
			.then(async (result) => {
				if (result === true) {
					dispatch(changeSeverity('success'));
					dispatch(changeNotification(`${t('register.10')}`));

					if (pictureForm) {
						await signUpService.setProfilePic(
							pictureForm, signedUpUser.username, language);
					}
					navigate('/login');
				} else {
					dispatch(changeSeverity('error'));
					dispatch(changeNotification(result));
				}
			})
			.catch((err) => {
				dispatch(changeSeverity('error'));
				dispatch(changeNotification('Signup request failed'));
			});
	};

	const setProfilePicture = async (event) => {
		const image = event.target.files[0];
		if (image.size > 5242880) {
			dispatch(changeSeverity('error'));
			dispatch(changeNotification(`${t('profile.0')}`));
		} else {
			let formData = new FormData();
			formData.append('file', image);
			setPictureForm(formData)
		}
		event.target.value = '';
	};

	return (
		<Container maxWidth="sm" sx={{ pt: 5, pb: 5 }}>
			<Paper elevation={10} sx={{ padding: 3 }}>
				<Typography
					variant="h5"
					align="center"
					sx={{ fontWeight: 550 }}
				>
					{t('register.1')}
				</Typography>
				<Typography align="center">{t('register.2')}</Typography>
				<form onSubmit={submitUser}>
					<TextField
						fullWidth
						margin="normal"
						name="username"
						label={t('register.3')}
						placeholder={t('register.3')}
						autoComplete="username"
						required
					/>
					<TextField
						sx={{ width: '49%', mr: '1%' }}
						margin="dense"
						name="firstname"
						label={t('register.4')}
						placeholder={t('register.4')}
						autoComplete="given-name"
						required
					/>
					<TextField
						sx={{ width: '49%', ml: '1%' }}
						margin="dense"
						name="lastname"
						label={t('register.5')}
						placeholder={t('register.5')}
						autoComplete="family-name"
						required
					/>
					<TextField
						type="email"
						fullWidth
						margin="dense"
						name="email"
						label={t('register.6')}
						placeholder={t('register.6')}
						autoComplete="email"
						required
					/>
					<TextField
						type="password"
						fullWidth
						margin="dense"
						name="password"
						label={t('register.7')}
						placeholder={t('register.7')}
						autoComplete="new-password"
						required
					/>
					<TextField
						type="password"
						fullWidth
						margin="dense"
						name="confirm_password"
						label={t('register.8')}
						placeholder={t('register.8')}
						autoComplete="new-password"
						required
					/>
					<Box>
						<Button theme={theme}>
							<label
								htmlFor="set_profilepic"
								className="styled-image-upload"
							>
								{t('profile.5')}
							</label>
							<input
								type="file"
								name="file"
								id="set_profilepic"
								accept="image/jpeg, image/png, image/jpg"
								onChange={setProfilePicture}
							></input>
						</Button>
					</Box>
					<Button
						type="submit"
						variant="contained"
						theme={theme}
						size="large"
						sx={{ mt: 1 }}
					>
						{t('register.9')}
					</Button>
				</form>
				<Notification />
			</Paper>
		</Container>
	);
};

export default Signup;
