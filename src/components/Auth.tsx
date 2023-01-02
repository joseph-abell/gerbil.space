import { useState } from "react";
import {
  Window,
  Button,
  WindowHeader,
  TextInput,
  WindowContent,
} from "react95";
import supabase from "../db";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Window className="window">
      <div>
        <WindowHeader>foodJournal.exe</WindowHeader>
        <WindowContent>
          <p>Sign in via magic link with your email below</p>
          {loading ? (
            "Sending magic link..."
          ) : (
            <form onSubmit={handleLogin}>
              <TextInput
                id="email"
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" fullWidth>
                Send magic link
              </Button>
            </form>
          )}
        </WindowContent>
      </div>
    </Window>
  );
};

export default Auth;