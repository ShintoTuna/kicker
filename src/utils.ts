import { Rating, Goals } from './types';

export const formatRating = (rating: Rating): number => Math.round((rating.mu - 3 * rating.sig) * 100);

export const formatGoals = (goals: Goals, own: boolean = false): number => {
    const avg = goals[own ? 'ownGoals' : 'goals'] / goals.games;

    return isNaN(avg) ? 0 : Math.round(avg * 100) / 100;
};

export const formatWins = (games: number, wins: number): number => Math.round(wins / games * 100);