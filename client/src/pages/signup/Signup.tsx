import { RegisterForm } from "@/components/register-form"
import { Toaster } from "@/components/ui/toaster";

function Signup() {


	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<RegisterForm />
				<Toaster />
			</div>
	  	</div>
	)
}

export default Signup;