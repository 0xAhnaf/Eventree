import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays, Heart, UserRound, Menu, X } from "lucide-react";
export default function EventWorkspaceSidebar() {
  const [open, setOpen] = useState(false);
  return <>
    <button className="me-menu me-secondary" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="events-sidebar"><Menu size={18}/> My dashboard</button>
    {open && <button className="me-scrim" aria-label="Close navigation" onClick={() => setOpen(false)}/>}
    <aside id="events-sidebar" className={"me-sidebar" + (open ? " me-open" : "")}>
      <div className="me-sidebar-heading"><div><h2>Welcome back</h2><p>Plan your memorable moments</p></div><button className="me-menu me-secondary" aria-label="Close navigation" onClick={() => setOpen(false)}><X size={18}/></button></div>
      <nav aria-label="Customer dashboard">
        {[[Heart,"Favorites","/favorites"],[CalendarDays,"My Events","/my-events"],[UserRound,"Profile","/profile"]].map(([Icon,label,path]) =>
          <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({isActive}) => isActive ? "me-nav me-active" : "me-nav"}><Icon size={18}/>{label}</NavLink>)}
      </nav>
    </aside>
  </>;
}
