import React, { FC, useState } from "react";
import { ProfileCard } from "./ProfileCard";
import { ProfileForm } from "./ProfileForm";

export interface MyProfileProps {}

export const MyProfile: FC<MyProfileProps> = (props) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <div>
      {isEditing ? (
        <ProfileForm onCancelClick={() => setIsEditing(false)} />
      ) : (
        <ProfileCard onEditClick={() => setIsEditing(true)} />
      )}
    </div>
  );
};
