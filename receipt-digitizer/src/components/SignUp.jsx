import { useState } from "react";

const Signup = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");
  const [error, setError] = useState("");

 const [isLoading, setIsLoading] = useState(false);

const handleSignup = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    // ...existing fetch logic
  } catch (err) {
    console.error(err);
    setError("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="max-w-sm mx-auto py-16 px-4">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

      <form onSubmit={handleSignup} className="space-y-4">
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

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
        >
          <option value="worker">Worker</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-3 rounded-xl"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <button onClick={onSwitchToLogin} className="text-green-600 font-medium">
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Signup;