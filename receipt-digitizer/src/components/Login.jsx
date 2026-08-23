import { useState } from "react";

const Login = ({ onLoginSuccess, onSwitchToSignup }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const result = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!result.ok) {
                const data = await result.json();
                setError(data.error || "Login failed");
                return;
            }

            const data = await result.json();
            // Save the token so future requests can use it
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);

            onLoginSuccess(data.role);
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        }
    };

    return (
        <div className="max-w-sm mx-auto py-16 px-4">
            <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>

            <form onSubmit={handleLogin} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl"
                >
                    Sign In
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <button onClick={onSwitchToSignup} className="text-green-600 font-medium">
                        Sign Up
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;