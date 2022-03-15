interface User {
  _id: string;
  username: string;
  author?: boolean;
  avatar: string;
}

export class CommentsDto {
  _id: string;
  content: string;
  user: User;
  children?: CommentsDto[];
  replyUser?: User;
  createdAt: string;
}
