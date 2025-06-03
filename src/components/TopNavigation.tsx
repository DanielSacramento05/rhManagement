
import { ProfileMenu } from "./ProfileMenu";

export function TopNavigation() {
  return (
    <div className="fixed top-0 left-0 right-0 w-full h-16 bg-background border-b border-border flex items-center justify-end px-4 z-40 shadow-sm">
      <ProfileMenu />
    </div>
  );
}
