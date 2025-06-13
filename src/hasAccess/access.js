const access = ({ moduleid, submoduleid, rolePermissions }) => {
    const module = rolePermissions?.find((module) => module?.moduleid === moduleid);
    if (!module?.modulestatus) {
        return { hasAccess: false };
    }

    if (submoduleid) {
        const submodule = module?.submodule?.find((sub) => sub?.submoduleid === submoduleid);

        if (!submodule?.submodulestatus) {
            return { hasAccess: false };
        }
    }

    return { hasAccess: true };
};

export default access;
