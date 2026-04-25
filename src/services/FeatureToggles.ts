type InviteCode = { code: string, isActive: boolean } | null;

const redirectPrompt = (inviteCode: InviteCode): boolean => {
    // Return true only if user has the "AIKI-STUDY-1" code 
    return inviteCode?.code === 'AIKI-STUDY-1' && inviteCode?.isActive === true;
}

// Map containing all features for feature flags
export const featureMap = (inviteCode: InviteCode) => ({
    redirectPrompt: redirectPrompt(inviteCode),
});

