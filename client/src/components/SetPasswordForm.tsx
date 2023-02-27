import {
	Box,
	Button,
	Container,
	TextField,
	Typography,
	FormControlLabel,
	Checkbox
} from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useField } from '../hooks/useField';
import { validatePassword, validateSetPasswordForm } from '../utils/inputValidators'; //validateSamePasswords function needed
import { AlertContext } from './AlertProvider';
import withAuthRequired from './AuthRequired';
import userService from '../services/users';
import Text from './Text';
import { useStateValue } from '../state';
import useModal from '../hooks/useModal';
import CustomModal from './CustomModal';

const SetPasswordForm = () => {
	const navigate = useNavigate();
	const alert = useContext(AlertContext);
	const [{ loggedUser }] = useStateValue();
	const [showPassword, setShow] = useState(false);

	const password = useField('text', <Text tid="textFieldPassword" />, validatePassword);
	const confirmPassword = useField(
		'text',
		<Text tid="textFieldConfirmPassword" />,
		validatePassword
	);

	const handleSetPassword = async (event: any) => {
		event.preventDefault();
		try {
			loggedUser &&
				(await userService.setPassword(
					password.value,
					confirmPassword.value,
					loggedUser.id
				));
			alert.success('alertSuccessSetPassword');
			navigate('/');
		} catch (err) {
			alert.error(err.response?.data?.error || 'alertErrorSetPassword');
		}
	};

	return (
		<Container component="main" sx={{ maxWidth: '100%', mt: 2, mb: 6 }}>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}
			>
				<Typography mb={3} textAlign="center">
					<Text tid="setPasswordInfoText" />
				</Typography>
				<Box
					component="form"
					noValidate
					sx={{ display: 'flex', flexDirection: 'column', width: '80%' }}
					onSubmit={handleSetPassword}
				>
					<input readOnly hidden type="text" autoComplete="username" />
					<TextField
						{...password}
						size="small"
						required
						autoFocus
						type={showPassword ? 'text' : 'password'}
						autoComplete="new-password"
						InputLabelProps={{ shrink: true }}
					/>
					<TextField
						{...confirmPassword}
						size="small"
						required
						type={showPassword ? 'text' : 'password'}
						autoComplete="new-password"
						InputLabelProps={{ shrink: true }}
					/>
					<FormControlLabel
						label={
							<Box component="div" fontSize={'0.9rem'}>
								<Text tid="showPasswords" />
							</Box>
						}
						control={
							<Checkbox
								color="primary"
								onChange={() => setShow(!showPassword)}
								icon={<VisibilityOffOutlinedIcon fontSize={'small'} />}
								checkedIcon={<VisibilityOutlinedIcon fontSize={'small'} />}
							/>
						}
					/>
					<Button
						type="submit"
						disabled={
							validateSetPasswordForm(password.value, confirmPassword.value)
								? false
								: true
						}
						variant="contained"
						sx={{ mt: 2, mb: 2 }}
					>
						<Text tid="submitBtn" />
					</Button>
				</Box>
			</Box>
		</Container>
	);
};

const SetPasswordFormModal = () => {
	const { isOpen, handleToggle, title, children } = useModal(
		<SetPasswordForm />,
		<Text tid="setPasswordForm" />
	);

	return (
		<CustomModal
			isOpen={!isOpen}
			handleToggle={handleToggle}
			title={title}
			children={children}
		/>
	);
};

export default withAuthRequired(SetPasswordFormModal);
