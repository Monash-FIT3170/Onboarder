import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Link,
	Checkbox,
	FormControlLabel,
	Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { supabase } from "../util/supabaseClient";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/RegisterPage.jpg";

const FlexContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	height: "calc(100vh - 200px)",
	minHeight: "500px",
	[theme.breakpoints.down("md")]: {
		height: "calc(100vh - 100px)",
	},
}));

const FormSection = styled(Box)(({ theme }) => ({
	flex: 1,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	alignItems: "center",
	padding: theme.spacing(4),
	[theme.breakpoints.up("md")]: {
		maxWidth: "50%",
	},
}));

const GoogleButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(2),
}));

const ImageSection = styled(Box)(({ theme }) => ({
	flex: 1,
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	[theme.breakpoints.down("md")]: {
		display: "none",
	},
}));

const StyledForm = styled("form")(() => ({
	width: "100%",
	maxWidth: "400px",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(2),
}));

const CoverImage = styled("img")({
	width: "100%",
	height: "80%",
	objectFit: "cover",
});

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Handle login logic here
		console.log({ email, password, rememberMe });
	};

	const handleGoogleLogin = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: "http://localhost:5173/login",
				},
			});

			if (error) console.error("Error logging in with Google:", error);
		} catch (error) {
			console.log("OAuth error");
		}
	};

	useEffect(() => {
		// Check for OAuth errors on page load
		const urlParams = new URLSearchParams(window.location.search);
		const error = urlParams.get("error");
		const errorDescription = urlParams.get("error_description");

		if (error) {
			console.error(`OAuth Error: ${error}, Description: ${errorDescription}`);

			// clearing the url params
			window.history.replaceState({}, document.title, window.location.pathname);

			if (errorDescription === "Database error saving new user") {
				setError(
					"Oops! It looks like you're not using a Monash email. Please sign in with your official Monash University email address."
				);
			}
		}

		// Check if user is signed in on initial component render
		const checkUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				// Redirecting user to dashboard if user is signed in
				navigate("/viewrecruitmentround");
			}
		};

		checkUser();
	}, [navigate]);

	return (
		<FlexContainer>
			<FormSection>
				<StyledForm onSubmit={handleSubmit} className="">
					<Typography component="h1" variant="h5" gutterBottom>
						Log In
					</Typography>
					<Typography variant="body2" color="textSecondary" gutterBottom>
						Don't have an account? <Link href="/register">Create one!</Link>
					</Typography>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email"
						name="email"
						autoComplete="email"
						autoFocus
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Link href="#" variant="body2">
						Forgot password?
					</Link>
					<br></br> {/* kingzel ECMA7 optimised*/}
					<FormControlLabel
						control={
							<Checkbox
								value="remember"
								color="primary"
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
							/>
						}
						label="Remember me"
					/>
					<SubmitButton type="submit" fullWidth variant="contained" color="primary">
						LOG IN
					</SubmitButton>
					<GoogleButton fullWidth variant="outlined" onClick={handleGoogleLogin}>
						Sign in with Google
					</GoogleButton>
					{error && (
						<Alert severity="error" sx={{ mt: 2, width: "100%", justifyContent: "center" }}>
							{error}
						</Alert>
					)}
				</StyledForm>
			</FormSection>
			<ImageSection>
				<CoverImage src={loginImage} alt="Login illustration" />
			</ImageSection>
		</FlexContainer>
	);
};

export default LoginPage;
