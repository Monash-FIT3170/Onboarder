import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Link,
	Checkbox,
	FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/system";
import { supabase } from "../util/supabaseClient";

const FlexContainer = styled(Box)(({ theme }) => ({
	display: "flex",
	height: "100vh",
	[theme.breakpoints.down("md")]: {
		flexDirection: "column",
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
	backgroundColor: "#f0f8ff", // Light blue background
	[theme.breakpoints.down("md")]: {
		minHeight: "300px",
	},
}));

const StyledForm = styled("form")(() => ({
	width: "100%",
	maxWidth: "400px",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(2),
}));

const LoginPage: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Handle login logic here
		console.log({ email, password, rememberMe });
	};

	const handleGoogleLogin = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: "http://localhost:5173/register",
			},
		});
		if (error) console.error("Error logging in with Google:", error);
	};

	useEffect(() => {
		const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN") {
				console.log("User signed in:", session?.user);
			}
		});

		return () => {
			authListener.subscription.unsubscribe();
		};
	}, []);

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
						Login with Google
					</GoogleButton>
				</StyledForm>
			</FormSection>
			<ImageSection>
				<img
					src="/path/to/your/login-image.png"
					alt="Login illustration"
					style={{ maxWidth: "100%", maxHeight: "100%" }}
				/>
			</ImageSection>
		</FlexContainer>
	);
};

export default LoginPage;
