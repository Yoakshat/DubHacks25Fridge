import type { Auth } from "firebase/auth"; 
import AuthForm from "../components/AuthForm";
// log in to existing account
import { signInWithEmailAndPassword } from "firebase/auth";

// for testing we moved stuff here (but should be only in signup)
export default function Login(){
    const handleLogin = async (auth: Auth, email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user
            console.log("User logged in:", user);
            
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error logging in:", error.message);
            } 
        }
    };

    return <AuthForm onSubmit={handleLogin} submitLabel={"Log in"} signup={false} />;
}
