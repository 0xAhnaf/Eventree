function RoleSwitch({
    role,
    setRole,
    customerText,
    vendorText
}) {
    return (
        <div className="role-switch">

            <button
                type="button"
                className={role === "customer" ? "active" : ""}
                onClick={() => setRole("customer")}
            >
                {customerText}
            </button>

            <button
                type="button"
                className={role === "vendor" ? "active" : ""}
                onClick={() => setRole("vendor")}
            >
                {vendorText}
            </button>

        </div>
    );
}

export default RoleSwitch;