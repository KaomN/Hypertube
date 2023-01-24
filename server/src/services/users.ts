// //prettier-ignore
// import { addPasswordResetRequest, findPasswordResetRequestByUserId, removePasswordResetRequest, removePasswordResetRequestByUserId } from '../repositories/passwordResetRequestRepository';
// //prettier-ignore
// import { addUpdateEmailRequest, findUpdateEmailRequestByUserId, removeUpdateEmailRequest, removeUpdateEmailRequestByUserId } from '../repositories/updateEmailRequestRepository';
// //prettier-ignore
// import { addNewUser, findUserByActivationCode, setUserAsActive, findUserByEmail, updateUserPassword, updateUserEmail, getPasswordHash, isUserById, getCompletenessByUserId, userHasPhotos, 
// 	userDataIsNotNULL, updateCompletenessByUserId, getUserDataByUserId, increaseReportCount, updateFameRatingByUserId, getFameRatingByUserId, findUsernameById, getUserEntry } from '../repositories/userRepository';
// //prettier-ignore
// import { Chat, ChatHeader, ChatMsg, EmailUpdateRequest, LikeAndMatchStatus, MessageNotification, NewUser, Notifications, PasswordResetRequest, Photo, ProfilePublic, User, UserData, UserEntry } from '../types';
// //prettier-ignore
// import { addMatchEntry, checkMatchEntry, checkMatchEntryWithReturn, getMatchByMatchId, getMatchesByUserId, removeMatchEntryWithReturn } from '../repositories/matchesRepository';
// import { addNotificationEntry, getNotificationsByNotifiedUserId, getNotificationsPageByNotifiedUserId } from '../repositories/notificationsRepository';
// import { addBlockEntry, checkBlockEntry, getBlockedUsersByBlockingUserId, removeBlockEntry } from '../repositories/blockEntriesRepository';
// import { addReportEntry, checkReportEntry, getReportEntriesByReportingUserId } from '../repositories/reportEntriesRepository';
// import { deleteNotificationsByMatchId, getChatNotificationsByReceiver } from '../repositories/chatNotificationsRepostiory';
// import { clearSessionsByUserId, updateSessionEmailByUserId } from '../repositories/sessionRepository';
// import { addLikeEntry, checkLikeEntry, removeLikeEntry } from '../repositories/likesRepository';
// import { getPhotosByUserId, updatePhotoByUserId } from '../repositories/photosRepository';
// import { addNotificationsQueueEntry } from '../repositories/notificationsQueueRepository';
// import { addMessageEntry, getMessagesByID } from '../repositories/chatRepository';
// import { addEntryToVisitHistory } from '../repositories/visitHistoryRepository';
// import { addUserOnline, getOnlineUser } from '../repositories/onlineRepository';
// import { assertNever, getAge, getDistance } from '../utils/helpers';
// import { requestCoordinatesByIp } from './location';
// import { sendMail } from '../utils/mailer';
// import { AppError } from '../errors';
// import { io } from '../app';
// import bcrypt from 'bcrypt';
// import crypto from 'crypto';

// //create
// export const createHashedPassword = async (passwordPlain: string): Promise<string> => {
// 	const saltRounds = 10;
// 	return await bcrypt.hash(passwordPlain, saltRounds);
// };

// export const createNewUser = async (newUser: NewUser, ipAddress: string | undefined): Promise<User> => {
// 	const passwordHash = await createHashedPassword(newUser.passwordPlain);
// 	const activationCode = crypto.randomBytes(20).toString('hex');

// 	const coordinates = await requestCoordinatesByIp(ipAddress);
// 	return addNewUser({ ...newUser, passwordHash, activationCode, lat: coordinates.lat, lon: coordinates.lon });
// };

// //activate
// export const sendActivationCode = (user: User): void => {
// 	sendMail(
// 		user.email,
// 		'Activation code for Matcha-account',
// 		`<h1>Hi and thanks for signing up!</h1>
// 			<p>Please visit the link to activate your account here:</p>
// 			<a href='http://localhost:3000/login?activate=${user.activationCode}'>Link</a>
// 			<p> See you at Matcha! <3 </p>`
// 	);
// };

// export const activateAccount = async (activationCode: string): Promise<void> => {
// 	const user = await findUserByActivationCode(activationCode);
// 	if (!user) {
// 		throw new AppError("Activation code doesn't exist", 400);
// 	}
// 	if (user.isActive) {
// 		throw new AppError('Account already activated', 400);
// 	}
// 	if (!user.isActive) {
// 		await setUserAsActive(activationCode);
// 	}
// };

// //reset forgotten password
// export const sendResetLink = async (email: string): Promise<void> => {
// 	const user = await findUserByEmail(email);
// 	if (!user) {
// 		throw new AppError("Couldn't find this email address.", 400);
// 	}

// 	if (!user.isActive) {
// 		throw new AppError('Account is not active, please activate account first.', 400);
// 	}

// 	const resetRequset = await findPasswordResetRequestByUserId(user.id);
// 	if (resetRequset) {
// 		await removePasswordResetRequest(resetRequset.token);
// 	}

// 	const newResetRequset = await addPasswordResetRequest(user.id);
// 	if (!newResetRequset) {
// 		throw new AppError('Error creating reset link, please try again', 400);
// 	}
// 	sendResetPasswordLink(user, newResetRequset);
// };

// export const sendResetPasswordLink = (user: User, newResetRequset: PasswordResetRequest): void => {
// 	sendMail(
// 		user.email,
// 		'Password reset link for Matcha-account',
// 		`<h1>Hi, forgot your password? No problem! !</h1>
// 			<p>Visit the link below to reset your password:</p>
// 			<a href='http://localhost:3000/forgot_password?reset=${newResetRequset.token}'>Reset password here</a>
// 			<p>Link will be active until ${newResetRequset.expiresAt}.</p>
// 			<p>Ignore this message if you haven't requested password reset.</p>

// 			<p> See you at Matcha! <3 </p>`
// 	);
// };

// export const changeForgottenPassword = async (userId: string, passwordPlain: string): Promise<void> => {
// 	const passwordHash = await createHashedPassword(passwordPlain);
// 	await updateUserPassword(userId, passwordHash);
// 	await removePasswordResetRequestByUserId(userId);
// };

// export const updatePassword = async (userId: string, oldPasswordPlain: string, newPasswordPlain: string): Promise<void> => {
// 	const oldPwdHash = await getPasswordHash(userId);
// 	const confirmOldPassword = await bcrypt.compare(oldPasswordPlain, oldPwdHash);
// 	if (!confirmOldPassword) {
// 		throw new AppError('Wrong old password, please try again', 400);
// 	}
// 	const passwordHash = await createHashedPassword(newPasswordPlain);
// 	await updateUserPassword(userId, passwordHash);
// };

// export const sendUpdateEmailLink = async (id: string, email: string): Promise<void> => {
// 	const userWithThisEmail = await findUserByEmail(email);
// 	if (userWithThisEmail) {
// 		if (userWithThisEmail.id === id) {
// 			throw new AppError('Please provide new email address', 400);
// 		} else {
// 			throw new AppError('This email is already taken. Please try another email address.', 400);
// 		}
// 	}
// 	const updateRequest = await findUpdateEmailRequestByUserId(id);
// 	if (updateRequest) {
// 		await removeUpdateEmailRequest(updateRequest.token);
// 	}

// 	const newUpdateRequest = await addUpdateEmailRequest(id, email);
// 	if (!newUpdateRequest) {
// 		throw new AppError('Error creating reset link, please try again', 400);
// 	}
// 	mailEmailUpdateLink(email, newUpdateRequest);
// };

// export const mailEmailUpdateLink = (email: User['email'], newUpdateRequest: EmailUpdateRequest): void => {
// 	sendMail(
// 		email,
// 		'Confirm email reset for Matcha-account',
// 		`<h1>Hi, here you can confirm email reset!</h1>
// 			<p>Visit the link below to reset your email:</p>
// 			<a href='http://localhost:3000/update_email?update=${newUpdateRequest.token}'>Reset email here</a>
// 			<p>Link will be active until ${newUpdateRequest.expiresAt}.</p>
// 			<p>Ignore this message if you haven't requested email reset.</p>

// 			<p> See you at Matcha! <3 </p>`
// 	);
// };

// export const changeUserEmail = async (emailResetRequest: EmailUpdateRequest): Promise<void> => {
// 	await updateUserEmail(emailResetRequest.userId, emailResetRequest.email);
// 	await removeUpdateEmailRequestByUserId(emailResetRequest.userId);
// 	await updateSessionEmailByUserId(emailResetRequest.userId, emailResetRequest.email);
// };