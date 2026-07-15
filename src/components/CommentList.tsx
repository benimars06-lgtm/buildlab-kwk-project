import Comment from "@/components/Comment";

type CommentListItem = {
  id: string;
  commenterName: string;
  profilePicture?: string | null;
  commentText: string;
};

type CommentListProps = {
  comments: CommentListItem[];
};

export default function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          commenterName={comment.commenterName}
          profilePicture={comment.profilePicture}
          commentText={comment.commentText}
        />
      ))}
    </div>
  );
}
