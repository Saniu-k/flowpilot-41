import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand } from "@/components/flowpilot/shell";
import { useIdentity } from "@/components/flowpilot/auth-context";
import { pageHead } from "@/lib/flowpilot/queries";
export const Route = createFileRoute("/auth")({
  head: () => pageHead("Sign in", "Sign in to your private PixelMirror personal workspace."),
  component: Auth,
});
function Auth() {
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useIdentity();
  const nav = useNavigate();
  useEffect(() => {
    if (user) nav({ to: "/" });
  }, [user, nav]);
  return (
    <div className="auth-page">
      <div className="auth-form">
        <Brand />
        <h1>{signup ? "Your personal workspace" : "Welcome back"}</h1>
        <p>
          {signup
            ? "Create an account to start working with PixelMirror."
            : "A clearer day starts here."}
        </p>
        <Button
          variant="outline"
          className="w-full"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            const r = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: window.location.origin,
            });
            if (r.error) setMessage(r.error.message);
            setBusy(false);
          }}
        >
          Continue with Google
        </Button>
        <div className="auth-divider">or continue with email</div>
        <form
          className="form-grid"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setMessage("");
            const r = signup
              ? await supabase.auth.signUp({
                  email,
                  password,
                  options: {
                    data: { display_name: name },
                    emailRedirectTo: window.location.origin,
                  },
                })
              : await supabase.auth.signInWithPassword({ email, password });
            if (r.error) setMessage(r.error.message);
            else if (signup && !r.data.session)
              setMessage("Check your email to confirm your account, then sign in.");
            setBusy(false);
          }}
        >
          {signup && (
            <label>
              Your name
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </label>
          )}
          <label>
            Email address
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </label>
          <label>
            Password
            <Input
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={signup ? "new-password" : "current-password"}
            />
          </label>
          <Button type="submit" disabled={busy}>
            {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
          </Button>
        </form>
        {message && (
          <p role="status" className="text-xs mt-4 text-info">
            {message}
          </p>
        )}
        <div className="auth-link-row">
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setSignup(!signup);
              setMessage("");
            }}
          >
            {signup ? "Already have an account? Sign in" : "New here? Create an account"}
          </Button>
        </div>
        <Button
          variant="link"
          size="sm"
          className="w-full"
          onClick={async () => {
            if (!email) {
              setMessage("Enter your email address first.");
              return;
            }
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: window.location.origin + "/reset-password",
            });
            setMessage(error ? error.message : "Check your email for a password reset link.");
          }}
        >
          Forgot password?
        </Button>
      </div>
    </div>
  );
}
