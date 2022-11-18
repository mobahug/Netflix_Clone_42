import { useState } from "react";
import { Link } from "react-router-dom";
import {
	Box,
	IconButton,
	Menu,
	MenuItem,
	Tooltip,
	Avatar,
} from "@mui/material";
import { useSelector } from "react-redux";

const UserMenu = ({ user, t }) => {
	const [anchorElUser, setAnchorElUser] = useState(null);
	const profileData = useSelector((state) => state.profile);
	if (profileData != null && Object.keys(profileData).length > 0)
		var profile_pic = profileData.profile_pic["picture_data"];

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};
	let translate1 = `${t("nav.3")}`;
	let translate2 = `${t("nav.6")}`;
	let translate3 = `${t("nav.5")}`;

	const settings = {};

	if (user) {
		settings[translate1] = "/profile";
		settings[translate2] = "/settings";
		settings[translate3] = "/logout";
	}

	if (user !== undefined && user !== "" && profile_pic !== undefined) {
		return (
			<>
				<Box sx={{ flexGrow: 0 }}>
					<Menu
						sx={{ mt: "45px" }}
						id="menu-appbar"
						anchorEl={anchorElUser}
						anchorOrigin={{ vertical: "top", horizontal: "right" }}
						keepMounted
						transformOrigin={{
							vertical: "top",
							horizontal: "right",
						}}
						open={Boolean(anchorElUser)}
						onClose={handleCloseUserMenu}
					>
						{Object.keys(settings).map((setting) => (
							<MenuItem
								key={setting}
								onClick={handleCloseUserMenu}
								component={Link}
								to={settings[setting]}
							>
								{setting}
							</MenuItem>
						))}
					</Menu>
					<Tooltip title="Open settings">
						<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
							<Avatar src={profile_pic} />
						</IconButton>
					</Tooltip>
				</Box>
			</>
		);
	}
};

export default UserMenu;
