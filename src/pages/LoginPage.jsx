
// export default LoginPage;
import { SignIn } from '@clerk/clerk-react';

const LoginPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <SignIn path="/login" routing="path" signUpUrl="/sign-up" />
  </div>
);

export default LoginPage;