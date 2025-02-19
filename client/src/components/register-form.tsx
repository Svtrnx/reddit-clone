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
import { CreateUser } from "@/services/auth/authService"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast()

  const auth = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const response = await CreateUser(username, password, email)
      console.log("successful:", response)
      toast({
        variant: "success",
        title: "Successful",
        description: "You have been created an account.",
      })
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
      
    } catch (error: any) {
      console.error("Failed:", error.response.data.error)
      toast({
        variant: "destructive",
        title: "Failed",
        description: error.response?.data?.error || error.message || "An unexpected error occurred.",
      })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle style={{margin: 'auto'}} className="text-2xl">Sign up</CardTitle>
          <CardDescription style={{margin: 'auto', marginTop: 10}}>
            Enter your credintials below to create account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={auth}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                />
              </div>
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
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="signin" className="underline underline-offset-4">
                Sign in
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
