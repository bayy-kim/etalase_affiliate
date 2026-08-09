"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Camera, Check, ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/avatar";
import { saveProfileAction, saveAvatarAction } from "@/server/actions/settings";
import type { Profile } from "@/lib/data";

export function SettingsForm({ profile }: { profile: Profile }) {
  const [preview, setPreview] = useState<string | null>(profile.avatar);
  const [profileState, profileAction, savingProfile] = useActionState(saveProfileAction, { ok: false });
  const [avatarState, avatarAction, savingAvatar] = useActionState(saveAvatarAction, { ok: false });

  const onPickFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Foto profil */}
      <section
        aria-labelledby="avatar-heading"
        className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-card p-5"
      >
        <h2 id="avatar-heading" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
          Foto Profil
        </h2>

        <div className="flex items-center gap-4">
          <Avatar
            name={profile.displayName}
            src={preview}
            className="h-20 w-20 shrink-0 text-3xl"
          />
          <div className="text-[13px] leading-5 text-text-secondary">
            Tempel link gambar <span className="font-[600] text-text-primary">atau</span> upload dari
            perangkat. Disimpan ke Vercel Blob.
          </div>
        </div>

        <form action={avatarAction} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="avatarUrl">Link foto (URL)</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              placeholder="https://.../foto.jpg"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex h-11 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-border-subtle bg-background-base px-4 text-[14px] font-[600] text-text-primary transition-colors hover:bg-surface-variant">
              <ImagePlus className="h-4 w-4 text-text-secondary" aria-hidden="true" />
              {preview && preview !== profile.avatar ? "Ganti file" : "Upload dari perangkat"}
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onPickFile(e.target.files?.[0])}
              />
            </label>
            <Button type="submit" disabled={savingAvatar} aria-busy={savingAvatar} className="shrink-0">
              <Camera className="h-4 w-4" aria-hidden="true" />
              Simpan Foto
            </Button>
          </div>

          {avatarState && "ok" in avatarState && avatarState.ok && (
            <p className="flex items-center gap-1.5 text-[13px] font-[600] text-secondary" role="status">
              <Check className="h-4 w-4" aria-hidden="true" /> Foto profil tersimpan.
            </p>
          )}
          {avatarState && "error" in avatarState && avatarState.error && (
            <p className="text-[13px] text-error" role="alert">
              {avatarState.error}
            </p>
          )}
        </form>
      </section>

      {/* Data profil */}
      <section
        aria-labelledby="profile-heading"
        className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface-card p-5"
      >
        <h2 id="profile-heading" className="text-[20px] font-[600] leading-7 tracking-[-0.01em] text-on-surface">
          Informasi Etalase
        </h2>

        <form action={profileAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName">Nama</Label>
            <Input id="displayName" name="displayName" defaultValue={profile.displayName} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="handle">Handle</Label>
            <Input id="handle" name="handle" defaultValue={profile.handle} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={3} defaultValue={profile.bio} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="link">Link Etalase</Label>
            <Input id="link" name="link" type="url" defaultValue={profile.link} />
          </div>

          {profileState && "ok" in profileState && profileState.ok && (
            <p className="flex items-center gap-1.5 text-[13px] font-[600] text-secondary" role="status">
              <Check className="h-4 w-4" aria-hidden="true" /> Profil tersimpan.
            </p>
          )}
          {profileState && "error" in profileState && profileState.error && (
            <p className="text-[13px] text-error" role="alert">
              {profileState.error}
            </p>
          )}

          <Button type="submit" disabled={savingProfile} aria-busy={savingProfile}>
            {savingProfile ? "Menyimpan..." : "Simpan Profil"}
          </Button>
        </form>
      </section>
    </div>
  );
}
