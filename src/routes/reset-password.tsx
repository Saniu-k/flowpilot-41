import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "@/components/flowpilot/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { pageHead } from "@/lib/flowpilot/queries";
export const Route = createFileRoute("/reset-password")({
  head: () => pageHead("Reset password", "Set a new password for your FlowPilot account."),
  component: Reset,
});
function Reset() {
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const hash = window.location.hash;
    setValid(hash.includes("type=recovery"));
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setValid(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <div className="auth-page">
      <form
        className="auth-form form-grid"
        onSubmit={async (e) => {
          e.preventDefault();
          const { error } = await supabase.auth.updateUser({ password });
          setMessage(error ? error.message : "Password updated. You can now sign in.");
        }}
      >
        <Brand />
        <h1>Reset your password</h1>
        {valid ? (
          <>
            <label>
              New password
              <Input
                type="password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <Button>Update password</Button>
          </>
        ) : (
          <p>Open your password reset email to continue.</p>
        )}
        <p role="status">{message}</p>
        <Button variant="link" asChild>
          <a href="/auth">Back to sign in</a>
        </Button>
      </form>
    </div>
  );
}
