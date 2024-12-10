import AuthForm from '@/components/AuthForm';

type SignInProps = {
  toggleFormType: () => void;
};

const SignIn = ({ toggleFormType }: SignInProps) => <AuthForm type="sign-in" toggleFormType={toggleFormType} />;

export default SignIn;
