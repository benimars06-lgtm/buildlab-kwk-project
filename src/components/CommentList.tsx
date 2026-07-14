import Comment from "@/components/Comment";

<<<<<<< HEAD
type CommentListItem = {
  id: string;
  commenterName: string;
  profilePicture?: string | null;
  commentText: string;
};

type CommentListProps = {
  comments: CommentListItem[];
=======
type CommentListProps = {
  comments: Array<{
    id: string;
    author: {
      name: string;
    };
    text: string;
  }>;
>>>>>>> 245c4c7 (Lesson 6 Updates: Delete After First PR)
};

export default function CommentList({ comments }: CommentListProps) {
  return (
<<<<<<< HEAD
    <div className="space-y-3">
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          commenterName={comment.commenterName}
          profilePicture={comment.profilePicture}
          commentText={comment.commentText}
        />
=======
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} />
>>>>>>> 245c4c7 (Lesson 6 Updates: Delete After First PR)
      ))}
    </div>
  );
}
