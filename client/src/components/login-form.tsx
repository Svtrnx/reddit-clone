import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Authenticate } from "@/services/auth/authService"
import { useToast } from "@/hooks/use-toast"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast()

  const auth = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const response = await Authenticate(username, password)
      console.log("Authentication successful:", response)
      toast({
        variant: "success",
        title: "Authentication Successful",
        description: "You have been successfully logged in.",
      })
      window.location.href = '/signin';
      
    } catch (error: any) {
      console.error("Authentication failed:", error.response.data.error)
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.response?.data?.error || error.message || "An unexpected error occurred.",
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle style={{margin: 'auto'}} className="text-2xl">Login</CardTitle>
          <CardDescription style={{margin: 'auto', marginTop: 10}}>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={auth}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="Your username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                    id="password"
                    type="password" required 
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
