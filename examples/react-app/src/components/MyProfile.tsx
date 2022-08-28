import { FC, useState } from "react";
import { ProfileCard } from "./ProfileCard";
import { ProfileForm } from "./ProfileForm";

export interface MyProfileProps {}

export const MyProfile: FC<MyProfileProps> = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <div>
      {isEditing ? (
        <ProfileForm backToProfileCard={() => setIsEditing(false)} />
      ) : (
        <ProfileCard onEditClick={() => setIsEditing(true)} />
      )}
    </div>
  );
};
