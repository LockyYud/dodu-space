"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login } from "@/server/ielts/auth";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, {});

  return (
    <Card>
      <CardContent className="p-5">
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="next" value={next} />
          <Input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            autoFocus
            required
          />
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Đang đăng nhập…" : "Đăng nhập"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
