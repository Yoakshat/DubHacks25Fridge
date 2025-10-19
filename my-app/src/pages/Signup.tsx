import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [kidEmail, setKidEmail] = useState('');
  const [isKid, setIsKid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isKid === null) {
      setError('Please select if you are a kid or not');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User signed up:", user);

      // 2️⃣ Create Firestore user document
      await setDoc(doc(db, "users", user.uid), {
        kidEmail: kidEmail || null,
        email,
        name: name.trim(),
        isKid,
        balance: 0,
        createdImages: [],
        ownedImages: [],
        fridge: [],
        receivedImages: [],
        friends: [],
        createdAt: Date.now()
      });
      console.log("User document created in Firestore");

      // 3️⃣ Create Stripe customer
      const res = await fetch("http://localhost:3000/create_customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          metadata: { firebaseUid: user.uid }
        }),
      });
      const { customer } = await res.json();

      // 4️⃣ Create connected account for kid
      await fetch("http://localhost:3000/create_connected_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kidEmail }),
      });

      // 5️⃣ Navigate to next step
      navigate('/loadCard', { state: { customerId: customer.id } });

    } catch (err) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 24, border: '2px solid #ddd', borderRadius: 12, backgroundColor: '#f9f9f9' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>🎨 Sign Up</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
          />
        </div>

        {/* Kid email (conditional) */}
        {isKid && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Your Kid's email</label>
            <input
              type="text"
              placeholder="Type their email here"
              value={kidEmail}
              onChange={(e) => setKidEmail(e.target.value)}
              style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 14 }}
            />
          </div>
        )}

        {/* Are you a kid? */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Are you a kid?</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="button" onClick={() => setIsKid(true)} style={{ flex: 1, padding: 12, backgroundColor: isKid === true ? '#4CAF50' : 'white', color: isKid === true ? 'white' : '#333', border: '2px solid #4CAF50', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}>Yes</button>
            <button type="button" onClick={() => setIsKid(false)} style={{ flex: 1, padding: 12, backgroundColor: isKid === false ? '#4CAF50' : 'white', color: isKid === false ? 'white' : '#333', border: '2px solid #4CAF50', borderRadius: 6, cursor: 'pointer', fontSize: 14, fontWeight: 'bold' }}>No</button>
          </div>
        </div>

        {error && <div style={{ padding: 12, marginBottom: 16, backgroundColor: '#fee', color: '#c33', borderRadius: 6, fontSize: 14 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 16, fontWeight: 'bold', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <p style={{ color: '#666', fontSize: 14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
