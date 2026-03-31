import AuthLayout from "@/components/auth-layout";
import CommentsPage from "@/components/comments-component";

export default async function Page({ id }: { id: string }) {
  return (
    <AuthLayout>
      <CommentsPage postId={id} />
    </AuthLayout>
  );
}
