import type { AuthUser } from '@/types';
export declare function useAuth(): {
    user: AuthUser | null;
    loading: boolean;
    login: () => void;
    logout: () => void;
};
