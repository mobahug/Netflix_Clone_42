import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import profileService from "../../services/profileService";
import { changeSeverity } from "../../reducers/severityReducer";
import { changeNotification } from "../../reducers/notificationReducer";

const DeleteUser = ({t}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		profileService.deleteUser().then((result) => {
			if (result === true) {
				dispatch(changeSeverity("success"));
				dispatch(changeNotification(`${t("del.4")}`));
				navigate("/logout");
			} else {
				dispatch(changeSeverity("error"));
				dispatch(changeNotification(result));
			}
		});
	}, [dispatch, navigate, t]);
};

export default DeleteUser;
