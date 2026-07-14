type CommentProps = {
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
    </article>
  );
}
