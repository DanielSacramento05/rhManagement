
import { ProfileMenu } from "./ProfileMenu";

export function TopNavigation() {
  return (
    <div className="fixed top-0 right-0 flex items-center p-4 gap-4 z-50">
      <ProfileMenu />
    </div>
  );
}
