import { Link } from 'react-router-dom';

const DietPlanCard = ({ plan }) => {
  const date = new Date(plan.created_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <Link to={`/plans/${plan.id}`} className="block group">
      <div className="card hover:shadow-md transition-shadow h-full border-l-4 border-l-emerald-500">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
            {plan.title || 'Personalized Diet Plan'}
          </h3>
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
            {plan.goal?.replace('_', ' ') || 'Goal'}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🔥</span>
            <span>{plan.target_calories} kcal/day</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🥗</span>
            <span className="capitalize">{plan.dietary_preference?.replace('_', ' ') || 'Any'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📅</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DietPlanCard;
