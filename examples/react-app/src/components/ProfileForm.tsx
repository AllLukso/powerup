import React, { FC, useEffect, useState } from "react";
import { Profile, UpdateProfileData } from '@strandgeek/powerup'
import { useProfile } from "../hooks/useProfile";
import { ImageMetadata } from "@lukso/lsp-factory.js";

export interface ProfileFormProps {}

export const ProfileForm: FC<ProfileFormProps> = (props) => {
  const [formData, setFormData] = useState<UpdateProfileData | null>(null)
  const profile = useProfile();
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        description: profile.description,
      })
    }
  }, [profile])
  const onSaveClick = async () => {
    if (!profile || !formData?.name || !formData.description) {
      return
    }
    await profile.update(formData)
  }
  if (!formData) {
    return null
  }
  const onTextFieldChange = (field: string) => (e: any) => setFormData((pd: any) => ({ ...pd, [field]: e.target.value }))
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Update Profile</h2>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={formData.name}
            onChange={onTextFieldChange('name')}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Bio</span>
          </label>
          <label>Image</label>
          <input type="file" onChange={(e) => {
            const { files } = e.target
            if (!files) {
              return
            }
            const file = files.length > 0 ? files[0]: null
            if (!file) {
              return
            }
            setFormData({
              ...formData,
              profileImage: file,
            })
          }}></input>
          <textarea
            className="textarea textarea-bordered"
            value={formData.description}
            onChange={onTextFieldChange('description')}
          ></textarea>
        </div>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-ghost">Cancel</button>
          <button className="btn btn-primary" onClick={onSaveClick}>Save</button>
        </div>
      </div>
    </div>
  );
};
