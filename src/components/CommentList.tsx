import Comment from "@/components/Comment";

type CommentListProps = {
  comments: Array<{
    id: string;
    author: {
      name: string;
    };
    text: string;
  }>;
};

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
