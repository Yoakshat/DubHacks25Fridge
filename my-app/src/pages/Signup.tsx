import type { Auth } from "firebase/auth"; 
import AuthForm from "../components/AuthForm";
// create a new user account
import { createUserWithEmailAndPassword } from "firebase/auth";

// later they will also need to mark are they a kid or not
export default function Signup(){
    const handleSignUp = async (auth: Auth, email: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", userCredential.user);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error signing up:", error.message);
            } 
        }
    };

    return <AuthForm onSubmit={handleSignUp} submitLabel="Sign Up" />;
}

