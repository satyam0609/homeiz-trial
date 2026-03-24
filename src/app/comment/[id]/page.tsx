import CommentsPage from "@/components/comments-component";

export default function Page({ params }: { params: { id: string } }) {
  return <CommentsPage postId={params.id} />;
}
