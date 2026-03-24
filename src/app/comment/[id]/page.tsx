import CommentsPage from "@/components/comments-component";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommentsPage postId={id} />;
}
