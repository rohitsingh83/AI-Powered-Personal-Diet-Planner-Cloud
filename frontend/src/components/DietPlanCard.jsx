import { Link } from 'react-router-dom';

const DietPlanCard = ({ plan }) => {
  const date = plan.created_at
    ? new Date(plan.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'Recent';

  const getGoalColor = (goal) => {
    switch (goal?.toLowerCase()) {
      case 'weight_loss':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'muscle_gain':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <Link to={`/plans/${plan.id}`} className="block group">
      <div className="card card-hover h-full flex flex-col justify-between border-slate-200/70 group-hover:border-emerald-300 relative overflow-hidden bg-white">
        <div className="space-y-3">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-base text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
              {plan.title || 'Personalized Diet Plan'}
            </h3>
            <span className={`pill-badge text-[10px] border whitespace-nowrap ${getGoalColor(plan.goal)}`}>
              {plan.goal ? plan.goal.replace('_', ' ') : 'Target'}
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">🔥</span>
              <span className="font-semibold text-slate-800">{plan.target_calories || 2000} kcal/day</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">🥦</span>
              <span className="capitalize font-medium">{plan.dietary_preference ? plan.dietary_preference.replace('_', ' ') : 'Balanced'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">📅</span>
              <span className="text-slate-500 font-medium">{date}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
          <span>View Detailed Schedule</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
};

export default DietPlanCard;
