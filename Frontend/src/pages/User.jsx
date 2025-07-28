import { useState } from "react";
import { Link } from "react-router-dom";

export function User() {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch(`${" http://127.0.0.1:5000"}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          PhoneNumber: PhoneNumber,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "Signup successful! Please login.",
        });
        setlastName("");
        setfirstName("");
        setEmail("");
        setPassword("");
        setPhoneNumber("");
      } else {
        setMessage({ type: "error", text: data.error || "Signup failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error" });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-10 bg-white rounded-xl shadow-xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-2">
            Welcome back!
          </h2>
          <p className="text-sm text-gray-500">
            Enter to get unlimited access to data & information.
          </p>
        </div>

        {message && (
          <div
            className={`p-3 rounded text-center font-medium ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor=" firstname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              firstName <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder=" firstName"
              value={firstName}
              onChange={(e) => setfirstName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label
              htmlFor=" firstname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
               lastName <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder=" lastName"
              value={lastName}
              onChange={(e) => setlastName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="phone number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              PhoneNumber <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Phone Number"
              value={PhoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          if you already have an existing account?{" "}
          <Link
            to={"/Login"}
            className="text-green-600 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
