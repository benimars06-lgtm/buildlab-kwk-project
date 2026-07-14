type CommentProps = {
<<<<<<< HEAD
  commenterName: string;
  profilePicture?: string | null;
  commentText: string;
};

export default function Comment({
  commenterName,
  profilePicture,
  commentText,
}: CommentProps) {
  const commenterInitial = commenterName.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
      {profilePicture ? (
        <img
          src={profilePicture}
          alt={`${commenterName}'s profile picture`}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600"
        >
          {commenterInitial}
        </div>
      )}

      <div className="min-w-0">
        <p className="font-semibold text-gray-900">{commenterName}</p>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">
          {commentText}
        </p>
      </div>
=======
  comment: {
    author: {
      name: string;
    };
    text: string;
  };
};

export default function Comment({ comment }: CommentProps) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="font-medium text-gray-900">{comment.author.name}</p>
      <p className="mt-2 whitespace-pre-wrap text-gray-700">{comment.text}</p>
>>>>>>> 245c4c7 (Lesson 6 Updates: Delete After First PR)
    </article>
  );
}
