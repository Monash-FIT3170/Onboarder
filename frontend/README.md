# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Authentication and Authorization

Setup:

1. Create a file named '.env' in the frontend directory (not root directory).
2. Add the following content to the .env file:

```
VITE_SUPABASE_URL=SUPABASE_URL
VITE_SUPABASE_KEY=SUPABASE_KEY
```

3. Replace SUPABASE_URL and SUPABASE_KEY with the actual values. This can be found in the discord chat in resources channel.
4. This is already added to gitignore so it wouldn't be committed.

Important: Keep your .env file secure. Never share its contents publicly or commit it to version control.

Features

- Authentication is restricted to Monash email addresses only
- Protected routes ensure access only for authenticated users
- User, team, and role information can be accessed from the auth store (authStore.js)

Auth Store

The auth store is implemented using Zustand. It manages the user's authentication state, team, and role and can be accessed globally from any component.

Example usage:

```typescript
const { user, team, role } = useAuthStore();
```

Protected routes

Pages are protected using the ProtectedRoute component. The ProtectedRoute component checks the user's authentication status and redirects to the login page if the user is not authenticated. To add a new protected route, place it within the ProtectedRoute element:

```typescript
<Route element={<ProtectedRoute />}>
	<Route path="/viewrecruitmentround" element={<ViewRecruitmentRoundPage />} />
	{/* Add other protected routes here */}
</Route>
```
