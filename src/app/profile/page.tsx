import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/shared/profile-form";

export default async function ProfilePage() {
  const session = await auth();
  const user = session!.user;

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Your profile</h1>
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user.name}</p>
              <Badge tone="indigo">{user.role}</Badge>
            </div>
          </div>
          <ProfileForm name={user.name ?? ""} email={user.email ?? ""} />
        </CardContent>
      </Card>
    </div>
  );
}
