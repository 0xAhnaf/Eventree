import { LogOut } from "lucide-react";
import eventreeLogo from "../../../assets/eventree-logo2.png";

function OnboardingHeader({ userEmail, onSignOut }) {
  return (
    <header className="vob-header">
      <div className="vob-brand">
        <img src={eventreeLogo} alt="Eventree" />
        <span>Eventree</span>
      </div>

      <div className="vob-account">
        <div>
          <span>Signed in as</span>
          <strong>{userEmail}</strong>
        </div>
        <button type="button" onClick={onSignOut}>
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </header>
  );
}

export default OnboardingHeader;
