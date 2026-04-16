type InviteCode = { code: string } | null;

const redirectPrompt = (inviteCode: InviteCode): boolean => {
    // Return true only if user has the REDIRECT-CODE (Code to be changed later)
    return inviteCode?.code === 'REDIRECT-CODE';
}

// Map containing all features for feature flags
export const featureMap = (inviteCode: InviteCode) => ({
    redirectPrompt: redirectPrompt(inviteCode),
});

