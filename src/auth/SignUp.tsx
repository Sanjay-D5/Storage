import AuthForm from '@/components/AuthForm';

type SignUpProps = {
  toggleFormType: () => void;
};

const SignUp = ({ toggleFormType }: SignUpProps) => <AuthForm type="sign-up" toggleFormType={toggleFormType} />;

export default SignUp;
